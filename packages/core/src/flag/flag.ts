import { Config } from "effect"

export function truthy(key: string) {
  const value = process.env[key]?.toLowerCase()
  return value === "true" || value === "1"
}

const copy = process.env["CODEABZ_EXPERIMENTAL_DISABLE_COPY_ON_SELECT"]
const fff = process.env["CODEABZ_DISABLE_FFF"]

function enabledByExperimental(key: string) {
  return process.env[key] === undefined ? truthy("CODEABZ_EXPERIMENTAL") : truthy(key)
}

export const Flag = {
  OTEL_EXPORTER_OTLP_ENDPOINT: process.env["OTEL_EXPORTER_OTLP_ENDPOINT"],
  OTEL_EXPORTER_OTLP_HEADERS: process.env["OTEL_EXPORTER_OTLP_HEADERS"],

  CODEABZ_AUTO_HEAP_SNAPSHOT: truthy("CODEABZ_AUTO_HEAP_SNAPSHOT"),
  CODEABZ_GIT_BASH_PATH: process.env["CODEABZ_GIT_BASH_PATH"],
  CODEABZ_CONFIG: process.env["CODEABZ_CONFIG"],
  CODEABZ_CONFIG_CONTENT: process.env["CODEABZ_CONFIG_CONTENT"],
  CODEABZ_DISABLE_AUTOUPDATE: truthy("CODEABZ_DISABLE_AUTOUPDATE"),
  CODEABZ_ALWAYS_NOTIFY_UPDATE: truthy("CODEABZ_ALWAYS_NOTIFY_UPDATE"),
  CODEABZ_DISABLE_PRUNE: truthy("CODEABZ_DISABLE_PRUNE"),
  CODEABZ_DISABLE_TERMINAL_TITLE: truthy("CODEABZ_DISABLE_TERMINAL_TITLE"),
  CODEABZ_SHOW_TTFD: truthy("CODEABZ_SHOW_TTFD"),
  CODEABZ_DISABLE_AUTOCOMPACT: truthy("CODEABZ_DISABLE_AUTOCOMPACT"),
  CODEABZ_DISABLE_MODELS_FETCH: truthy("CODEABZ_DISABLE_MODELS_FETCH"),
  CODEABZ_DISABLE_MOUSE: truthy("CODEABZ_DISABLE_MOUSE"),
  CODEABZ_FAKE_VCS: process.env["CODEABZ_FAKE_VCS"],
  CODEABZ_SERVER_PASSWORD: process.env["CODEABZ_SERVER_PASSWORD"],
  CODEABZ_SERVER_USERNAME: process.env["CODEABZ_SERVER_USERNAME"],
  CODEABZ_DISABLE_FFF: fff === undefined ? process.platform === "win32" : truthy("CODEABZ_DISABLE_FFF"),

  // Experimental
  CODEABZ_EXPERIMENTAL_FILEWATCHER: Config.boolean("CODEABZ_EXPERIMENTAL_FILEWATCHER").pipe(
    Config.withDefault(false),
  ),
  CODEABZ_EXPERIMENTAL_DISABLE_FILEWATCHER: Config.boolean("CODEABZ_EXPERIMENTAL_DISABLE_FILEWATCHER").pipe(
    Config.withDefault(false),
  ),
  CODEABZ_EXPERIMENTAL_DISABLE_COPY_ON_SELECT:
    copy === undefined ? process.platform === "win32" : truthy("CODEABZ_EXPERIMENTAL_DISABLE_COPY_ON_SELECT"),
  CODEABZ_MODELS_URL: process.env["CODEABZ_MODELS_URL"],
  CODEABZ_MODELS_PATH: process.env["CODEABZ_MODELS_PATH"],
  CODEABZ_DB: process.env["CODEABZ_DB"],

  CODEABZ_WORKSPACE_ID: process.env["CODEABZ_WORKSPACE_ID"],
  CODEABZ_EXPERIMENTAL_WORKSPACES: enabledByExperimental("CODEABZ_EXPERIMENTAL_WORKSPACES"),

  // Evaluated at access time (not module load) because tests, the CLI, and
  // external tooling set these env vars at runtime.
  get CODEABZ_DISABLE_PROJECT_CONFIG() {
    return truthy("CODEABZ_DISABLE_PROJECT_CONFIG")
  },
  get CODEABZ_EXPERIMENTAL_REFERENCES() {
    return enabledByExperimental("CODEABZ_EXPERIMENTAL_REFERENCES")
  },
  get CODEABZ_TUI_CONFIG() {
    return process.env["CODEABZ_TUI_CONFIG"]
  },
  get CODEABZ_CONFIG_DIR() {
    return process.env["CODEABZ_CONFIG_DIR"]
  },
  get CODEABZ_PURE() {
    return truthy("CODEABZ_PURE")
  },
  get CODEABZ_PERMISSION() {
    return process.env["CODEABZ_PERMISSION"]
  },
  get CODEABZ_PLUGIN_META_FILE() {
    return process.env["CODEABZ_PLUGIN_META_FILE"]
  },
  get CODEABZ_CLIENT() {
    return process.env["CODEABZ_CLIENT"] ?? "cli"
  },
}
