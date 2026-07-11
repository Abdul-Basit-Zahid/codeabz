import path from "path"

process.env.CODEABZ_DB = ":memory:"
process.env.CODEABZ_MODELS_PATH = path.join(import.meta.dir, "plugin", "fixtures", "models-dev.json")
process.env.CODEABZ_DISABLE_MODELS_FETCH = "true"
