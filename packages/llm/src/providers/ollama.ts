import { ProviderID, type ModelID } from "../schema"
import * as OpenAICompatibleChat from "../protocols/openai-compatible-chat"
import type { RouteDefaultsInput } from "../route/client"
import { AuthOptions, type ProviderAuthOption } from "../route/auth-options"

export const id = ProviderID.make("ollama")

const DEFAULT_BASE_URL = "http://localhost:11434/v1"
const OLLAMA_API_BASE = "http://localhost:11434"

export type OllamaModelInput = RouteDefaultsInput & ProviderAuthOption<"optional">

export const routes = [OpenAICompatibleChat.route]

export const configure = (input: OllamaModelInput = {}) => {
  const baseURL = input.baseURL ?? DEFAULT_BASE_URL
  const { baseURL: _, ...rest } = input
  const route = OpenAICompatibleChat.route.with({
    ...rest,
    provider: "ollama",
    endpoint: { baseURL },
    auth: AuthOptions.bearer(input, []),
  })
  return {
    id,
    model: (modelID: string | ModelID) => route.model({ id: modelID, provider: id }),
    configure,
  }
}

export const discoverModels = async (baseURL?: string) => {
  const apiBase = baseURL?.replace("/v1", "") ?? OLLAMA_API_BASE
  try {
    const res = await fetch(`${apiBase}/api/tags`)
    if (!res.ok) return []
    const data = await res.json() as { models?: Array<{ name: string }> }
    return (data.models ?? []).map((m) => m.name)
  } catch {
    return []
  }
}

export const provider = configure()
export const model = provider.model
