import { spawn, execSync } from "child_process"
import fs from "fs"
import path from "path"
import os from "os"
import http from "http"

const OLLAMA_PORT = 11434
const OLLAMA_HOST = `http://localhost:${OLLAMA_PORT}`
const OLLAMA_API_TAGS = `${OLLAMA_HOST}/api/tags`

function isWindows() {
  return os.platform() === "win32"
}

function isMacOS() {
  return os.platform() === "darwin"
}

function isLinux() {
  return os.platform() === "linux"
}

function httpGet(url: string): Promise<{ ok: boolean }> {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      resolve({ ok: res.statusCode === 200 })
      res.resume()
    })
    req.on("error", () => resolve({ ok: false }))
    req.setTimeout(3000, () => {
      req.destroy()
      resolve({ ok: false })
    })
  })
}

export async function isOllamaRunning(): Promise<boolean> {
  try {
    const res = await httpGet(OLLAMA_API_TAGS)
    return res.ok
  } catch {
    return false
  }
}

function findOllamaOnPath(): string | null {
  const paths = (process.env.PATH || "").split(path.delimiter)
  const binary = isWindows() ? "ollama.exe" : "ollama"
  for (const dir of paths) {
    try {
      const full = path.join(dir, binary)
      if (fs.existsSync(full)) return full
    } catch {}
  }
  return null
}

function findOllamaCommonPaths(): string | null {
  const candidates: string[] = []
  if (isWindows()) {
    candidates.push(
      path.join(process.env["ProgramFiles"] || "C:\\Program Files", "Ollama", "ollama.exe"),
      path.join(process.env["LOCALAPPDATA"] || "", "Ollama", "ollama.exe"),
      path.join(os.homedir(), "AppData", "Local", "Ollama", "ollama.exe"),
    )
  } else if (isMacOS()) {
    candidates.push(
      "/Applications/Ollama.app/Contents/Resources/ollama",
      "/usr/local/bin/ollama",
      path.join(os.homedir(), ".ollama", "ollama"),
    )
  } else if (isLinux()) {
    candidates.push(
      "/usr/local/bin/ollama",
      "/usr/bin/ollama",
      path.join(os.homedir(), ".ollama", "ollama"),
    )
  }
  for (const c of candidates) {
    try {
      if (fs.existsSync(c)) return c
    } catch {}
  }
  return null
}

function findOllama(): string | null {
  return findOllamaOnPath() || findOllamaCommonPaths()
}

async function downloadAndInstallOllama(): Promise<string | null> {
  if (isWindows()) {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "codeabz-ollama-"))
    const installer = path.join(tmpDir, "OllamaSetup.exe")
    const url = "https://ollama.com/download/OllamaSetup.exe"
    process.stderr.write(`Downloading Ollama installer...\n`)
    try {
      execSync(`curl -sL "${url}" -o "${installer}"`, { stdio: "pipe", timeout: 120_000 })
      process.stderr.write(`Installing Ollama (this may take a moment)...\n`)
      execSync(`"${installer}" /S`, { stdio: "pipe", timeout: 60_000 })
      try { fs.rmSync(tmpDir, { recursive: true }) } catch {}
      return findOllama()
    } catch (e) {
      process.stderr.write(`Failed to install Ollama automatically.\n`)
      process.stderr.write(`Please install it manually from https://ollama.com\n`)
      try { fs.rmSync(tmpDir, { recursive: true }) } catch {}
      return null
    }
  } else if (isMacOS() || isLinux()) {
    process.stderr.write(`Downloading and installing Ollama...\n`)
    try {
      execSync("curl -fsSL https://ollama.com/install.sh | sh", { stdio: "pipe", timeout: 120_000 })
      return findOllama()
    } catch {
      process.stderr.write(`Failed to install Ollama automatically.\n`)
      process.stderr.write(`Please install it manually from https://ollama.com\n`)
      return null
    }
  }
  return null
}

async function waitForOllama(timeoutMs = 30000): Promise<boolean> {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    if (await isOllamaRunning()) return true
    await new Promise((r) => setTimeout(r, 1000))
  }
  return false
}

async function startOllamaServe(binPath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const child = spawn(binPath, ["serve"], {
      stdio: "ignore",
      detached: true,
      windowsHide: true,
    })
    child.unref()
    // Give it a few seconds to start
    setTimeout(async () => {
      const ok = await waitForOllama(15000)
      resolve(ok)
    }, 2000)
  })
}

async function pullDefaultModel(binPath: string): Promise<void> {
  const models = ["llama3.2:3b", "llama3.2:1b", "phi3:mini", "qwen2.5:1.5b"]
  for (const model of models) {
    try {
      process.stderr.write(`Pulling ${model} (this may take a while on first run)...\n`)
      execSync(`"${binPath}" pull ${model}`, { stdio: "pipe", timeout: 600_000 })
      return
    } catch {}
  }
}

export async function ensureOllama(): Promise<boolean> {
  if (await isOllamaRunning()) return true

  let binPath = findOllama()
  if (!binPath) {
    process.stderr.write(`Ollama not found. Installing automatically...\n`)
    binPath = await downloadAndInstallOllama()
    if (!binPath) return false
  }

  process.stderr.write(`Starting Ollama...\n`)
  const started = await startOllamaServe(binPath)
  if (!started) return false

  process.stderr.write(`Checking for models...\n`)
  try {
    const res = await httpGet(OLLAMA_API_TAGS)
    if (res.ok) {
      const body = await new Promise<string>((resolve) => {
        http.get(`${OLLAMA_API_TAGS}`, (res) => {
          let data = ""
          res.on("data", (chunk: Buffer) => data += chunk.toString())
          res.on("end", () => resolve(data))
        })
      })
      const parsed = JSON.parse(body)
      if (!parsed.models || parsed.models.length === 0) {
        await pullDefaultModel(binPath)
      }
    }
  } catch {}

  return true
}
