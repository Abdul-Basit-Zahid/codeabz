@echo off
cd /d "%~dp0"
bun run --cwd packages/codeabz src/index.ts
pause
