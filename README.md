<p align="center">
  <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="CodeABZ logo" width="200">
</p>
<p align="center"><strong>CodeABZ</strong> — The AI coding agent. Ollama-first, local & free.</p>
<p align="center">
  <em>Based on <a href="https://github.com/Abdul-Basit-Zahid/codeabz">codeabz</a> (MIT License)</em>
</p>

---

**CodeABZ** is an AI coding agent that runs entirely on your machine using Ollama's local models. No API keys, no cloud costs, no data leaving your computer.

### Features

- **Ollama-first** — Auto-discovers your installed local models
- **Rich TUI** — Terminal UI with streaming, diffs, and tool execution
- **Built-in tools** — read, write, edit, bash, glob, grep, web fetch, and more
- **Two modes** — Interactive chat + autonomous task execution
- **Free & offline** — 100% local, no internet required after setup
- **Extensible** — Add cloud providers later if you want (OpenAI, Anthropic, etc.)

### Quick Start

```bash
# Prerequisites: Install Ollama from https://ollama.com
# Then pull a model, e.g.:
ollama pull llama3.2

# Run codeabz
npx codeabz
```

### Installation

```bash
npm i -g codeabz
```

Or from source:

```bash
git clone https://github.com/Abdul-Basit-Zahid/codeabz.git
cd codeabz
bun install
bun run --cwd packages/codeabz src/index.ts
```

### Usage

```bash
codeabz                  # Interactive chat (auto-discovers Ollama models)
codeabz run "fix this bug"  # Autonomous task mode
```

### License

CodeABZ is based on [codeabz](https://github.com/Abdul-Basit-Zahid/codeabz) which is MIT licensed. This project maintains the same license.

---

**Disclaimer:** This project is a fork of codeabz and is not affiliated with the codeabz team or anomalyco.
