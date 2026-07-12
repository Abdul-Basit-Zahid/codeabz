@echo off
set OLLAMA_FLASH_ATTENTION=1
cd /d "%~dp0"
bun run --cwd packages/codeabz src/index.ts
pause
