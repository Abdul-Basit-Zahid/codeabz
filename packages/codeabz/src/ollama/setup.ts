import { spawn } from "child_process"
import fs from "fs"
import path from "path"
import os from "os"
import http from "http"

const OLLAMA_API = "http://localhost:11434/api/tags"

function quickFetch(url: string, timeoutMs = 1000): Promise<boolean> {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      resolve(res.statusCode === 200)
      res.resume()
    })
    req.on("error", () => resolve(false))
    req.setTimeout(timeoutMs, () => { req.destroy(); resolve(false) })
  })
}

export async function isOllamaRunning(): Promise<boolean> {
  return quickFetch(OLLAMA_API)
}

function findOllama(): string | null {
  const binary = os.platform() === "win32" ? "ollama.exe" : "ollama"
  const dirs = (process.env.PATH || "").split(path.delimiter)
  for (const d of dirs) {
    const full = path.join(d, binary)
    if (fs.existsSync(full)) return full
  }
  const extras: string[] = []
  if (os.platform() === "win32") {
    const local = process.env.LOCALAPPDATA || path.join(os.homedir(), "AppData", "Local")
    extras.push(
      path.join(process.env.ProgramFiles || "C:\\Program Files", "Ollama", binary),
      path.join(local, "Ollama", binary),
      path.join(local, "Programs", "Ollama", binary),
    )
  } else if (os.platform() === "darwin") {
    extras.push("/Applications/Ollama.app/Contents/Resources/ollama", "/usr/local/bin/ollama")
  } else {
    extras.push("/usr/local/bin/ollama", "/usr/bin/ollama")
  }
  for (const e of extras) {
    if (fs.existsSync(e)) return e
  }
  return null
}

export async function ensureOllama(): Promise<void> {
  if (await isOllamaRunning()) return
  const bin = findOllama()
  if (!bin) return
  const child = spawn(bin, ["serve"], { stdio: "ignore", detached: true, windowsHide: true })
  child.unref()
  // Quick wait - 3s max
  for (let i = 0; i < 6; i++) {
    if (await quickFetch(OLLAMA_API)) return
    await new Promise((r) => setTimeout(r, 500))
  }
}
