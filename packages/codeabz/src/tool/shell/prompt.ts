import { Schema } from "effect"
import DESCRIPTION from "./shell.txt"
import { PositiveInt } from "@codeabz/core/schema"
import { Global } from "@codeabz/core/global"
import { ShellID } from "./id"

const PS = new Set(["powershell", "pwsh"])
const CMD = new Set(["cmd"])

export type Limits = {
  maxLines: number
  maxBytes: number
}

export function parameterSchema() {
  return Schema.Struct({
    command: Schema.String.annotate({ description: "The command to execute" }),
    timeout: Schema.optional(PositiveInt).annotate({ description: "Optional timeout in milliseconds" }),
    workdir: Schema.optional(Schema.String).annotate({
      description: `The working directory to run the command in. Defaults to the current directory. Use this instead of 'cd' commands.`,
    }),
  })
}

export const Parameters = parameterSchema()
export type Parameters = Schema.Schema.Type<typeof Parameters>

function renderPrompt(template: string, values: Record<string, string>) {
  return template.replace(/\$\{(\w+)\}/g, (_, key: string) => {
    const value = values[key]
    if (value === undefined) throw new Error(`Missing shell prompt value: ${key}`)
    return value
  })
}

function shellDisplayName(name: string) {
  if (name === "pwsh") return "PowerShell (7+)"
  if (name === "powershell") return "Windows PowerShell (5.1)"
  if (name === "cmd") return "cmd.exe"
  return name
}

function powershellNotes(name: string) {
  if (name === "pwsh") {
    return `# PowerShell (7+) shell notes
- This cross-platform shell supports pipeline chain operators (\`&&\` and \`||\`).
- Use double quotes for interpolated strings (\`"Hello $name"\`), single quotes for verbatim strings.
- Prefer full cmdlet names like \`Get-ChildItem\`, \`Set-Content\`, \`Remove-Item\`, and \`New-Item\` over aliases.
- Use \`$(...)\` for subexpressions. Use \`@(...)\` for array expressions.
- To call a native executable whose path contains spaces, use the call operator: \`& "path/to/exe" args\`.
- Escape special characters with the PowerShell backtick character.`
  }
  if (name === "powershell") {
    return `# Windows PowerShell (5.1) shell notes
- Use \`cmd1; if ($?) { cmd2 }\` to chain dependent commands.
- Use double quotes for interpolated strings (\`"Hello $name"\`), single quotes for verbatim strings.
- Prefer full cmdlet names like \`Get-ChildItem\`, \`Set-Content\`, \`Remove-Item\`, and \`New-Item\` over aliases.
- Use \`$(...)\` for subexpressions. Use \`@(...)\` for array expressions.
- To call a native executable whose path contains spaces, use the call operator: \`& "path/to/exe" args\`.
- Escape special characters with the PowerShell backtick character.`
  }
  return ""
}

function chainGuidance(name: string) {
  if (name === "powershell") {
    return "If the commands depend on each other and must run sequentially, avoid '&&' in this shell because Windows PowerShell (5.1) does not support it. Use PowerShell conditionals such as `cmd1; if ($?) { cmd2 }` when later commands must depend on earlier success."
  }
  if (PS.has(name)) {
    return "If the commands depend on each other and must run sequentially, use a single bash tool call with '&&' to chain them together (e.g., `git add . && git commit -m \"message\" && git push`). For instance, if one operation must complete before another starts (like New-Item before Copy-Item, Write before bash for git operations, or git add before git commit), run these operations sequentially instead."
  }
  if (CMD.has(name)) {
    return "If the commands depend on each other and must run sequentially, use a single bash tool call with `&&` to chain them together (e.g., `mkdir out && dir out`). For instance, if one operation must complete before another starts, run these operations sequentially instead."
  }
  return "If the commands depend on each other and must run sequentially, use a single Bash call with '&&' to chain them together (e.g., `git add . && git commit -m \"message\" && git push`). For instance, if one operation must complete before another starts (like mkdir before cp, Write before Bash for git operations, or git add before git commit), run these operations sequentially instead."
}

function bashCommandSection(chain: string, limits: Limits, defaultTimeoutMs: number) {
  return `optional timeout (${defaultTimeoutMs}ms), output truncated at ${limits.maxLines} lines. Prefer Read/Edit/Write/Glob/Grep tools over shell commands for file ops. Use workdir parameter instead of cd.`
}

function powershellCommandSection(
  name: string,
  chain: string,
  pathSep: string,
  limits: Limits,
  defaultTimeoutMs: number,
) {
  return `${powershellNotes(name)}
optional timeout (${defaultTimeoutMs}ms), output truncated at ${limits.maxLines} lines. Prefer Read/Edit/Write/Glob/Grep over shell cmdlets. Use workdir parameter.`
}

function cmdCommandSection(chain: string, limits: Limits, defaultTimeoutMs: number) {
  return `optional timeout (${defaultTimeoutMs}ms), output truncated at ${limits.maxLines} lines. Prefer Read/Edit/Write/Glob/Grep over cmd commands. Use workdir parameter. Use double quotes for paths with spaces.`
}

function profile(name: string, platform: NodeJS.Platform, limits: Limits, defaultTimeoutMs: number) {
  const isPowerShell = PS.has(name)
  const chain = chainGuidance(name)
  if (CMD.has(name)) {
    return {
      intro: `Executes a ${shellDisplayName(name)} command with optional timeout.`,
      workdirSection:
        "All commands run in CWD by default. Use workdir parameter to run in a different directory.",
      commandSection: cmdCommandSection(chain, limits, defaultTimeoutMs),
      gitCommands: "git commands",
      gitCommandRestriction: "git commands",
      createPrInstruction: "Create PR using a temporary body file so cmd.exe quoting stays simple.",
      createPrExample: `(\n  echo ## Summary\n  echo - ^<1-3 bullet points^>\n) > pr-body.txt\ngh pr create --title "the pr title" --body-file pr-body.txt`,
    }
  }
  if (isPowerShell) {
    return {
      intro: `Executes a ${shellDisplayName(name)} command with optional timeout.`,
      workdirSection:
        "All commands run in CWD by default. Use workdir parameter to run in a different directory.",
      commandSection: powershellCommandSection(
        name,
        chain,
        platform === "win32" ? "\\" : "/",
        limits,
        defaultTimeoutMs,
      ),
      gitCommands: "git commands",
      gitCommandRestriction: "git commands",
      createPrInstruction: "Create PR using gh pr create with a PowerShell here-string to pass the body correctly.",
      createPrExample: `gh pr create --title "the pr title" --body @'
## Summary
- <1-3 bullet points>
'@`,
    }
  }
  return {
    intro:
      "Executes a bash command with optional timeout.",
    workdirSection:
      "All commands run in CWD by default. Use workdir parameter to run in a different directory.",
    commandSection: bashCommandSection(chain, limits, defaultTimeoutMs),
    gitCommands: "bash commands",
    gitCommandRestriction: "git bash commands",
    createPrInstruction:
      "Create PR using gh pr create with the format below. Use a HEREDOC to pass the body to ensure correct formatting.",
    createPrExample: `gh pr create --title "the pr title" --body "$(cat <<'EOF'
## Summary
<1-3 bullet points>`,
  }
}

export function render(name: string, platform: NodeJS.Platform, limits: Limits, defaultTimeoutMs: number) {
  const selected = profile(name, platform, limits, defaultTimeoutMs)
  return {
    description: renderPrompt(DESCRIPTION, {
      intro: selected.intro,
      os: platform,
      shell: name,
      tmp: Global.Path.tmp,
      workdirSection: selected.workdirSection,
      commandSection: selected.commandSection,
      gitCommands: selected.gitCommands,
      toolName: ShellID.ToolID,
      gitCommandRestriction: selected.gitCommandRestriction,
      createPrInstruction: selected.createPrInstruction,
      createPrExample: selected.createPrExample,
    }),
    parameters: parameterSchema(),
  }
}

export * as ShellPrompt from "./prompt"
