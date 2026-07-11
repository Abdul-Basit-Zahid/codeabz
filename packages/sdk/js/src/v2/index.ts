export * from "./client.js"
export * from "./server.js"

import { createcodeabzClient } from "./client.js"
import { createcodeabzServer } from "./server.js"
import type { ServerOptions } from "./server.js"

export * as data from "./data.js"

export async function createcodeabz(options?: ServerOptions) {
  const server = await createcodeabzServer({
    ...options,
  })

  const client = createcodeabzClient({
    baseUrl: server.url,
  })

  return {
    client,
    server,
  }
}
