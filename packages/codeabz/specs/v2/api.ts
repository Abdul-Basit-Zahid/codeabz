// @ts-nocheck

import { codeabz } from "@codeabz/core"
import { ReadTool } from "@codeabz/core/tools"

const codeabz = codeabz.make({})

codeabz.tool.add(ReadTool)

codeabz.tool.add({
  name: "bash",
  schema: {
    type: "object",
    properties: {
      command: {
        type: "string",
        description: "The command to run.",
      },
    },
    required: ["command"],
  },
  execute(input, ctx) {},
})

codeabz.auth.add({
  provider: "openai",
  type: "api",
  value: process.env.OPENAI_API_KEY,
})

codeabz.agent.add({
  name: "build",
  permissions: [],
  model: {
    id: "gpt-5-5",
    provider: "openai",
    variant: "xhigh",
  },
})

const sessionID = await codeabz.session.create({
  agent: "build",
})

codeabz.subscribe((event) => {
  console.log(event)
})

await codeabz.session.prompt({
  sessionID,
  text: "hey what is up",
})

await codeabz.session.prompt({
  sessionID,
  text: "what is up with this",
  files: [
    {
      mime: "image/png",
      uri: "data:image/png;base64,xxxx",
    },
  ],
})

await codeabz.session.wait()

console.log(await codeabz.session.messages(sessionID))
