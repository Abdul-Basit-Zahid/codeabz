import { expect, test } from "bun:test"
import { Schema } from "effect"
import { AgentV2 } from "@codeabz/core/agent"
import { Location as CoreLocation } from "@codeabz/core/location"
import { ModelV2 } from "@codeabz/core/model"
import { SessionV2 } from "@codeabz/core/session"
import { SessionInput as CoreSessionInput } from "@codeabz/core/session/input"
import { SessionMessage as CoreSessionMessage } from "@codeabz/core/session/message"
import { Prompt as CorePrompt } from "@codeabz/core/session/prompt"
import { Agent } from "@codeabz/schema/agent"
import { Location } from "@codeabz/schema/location"
import { Model } from "@codeabz/schema/model"
import { Project } from "@codeabz/schema/project"
import { Provider } from "@codeabz/schema/provider"
import { Prompt } from "@codeabz/schema/prompt"
import { Session } from "@codeabz/schema/session"
import { SessionInput } from "@codeabz/schema/session-input"
import { SessionMessage } from "@codeabz/schema/session-message"
import { Workspace } from "@codeabz/schema/workspace"
import { Api } from "@codeabz/server/api"
import { compile, emitPromise } from "@codeabz/httpapi-codegen"
import { ClientApi, endpointNames, groupNames, omitEndpoints } from "../src/contract"

test("Core and Server reuse the authoritative Schema and Protocol values", () => {
  expect(AgentV2.ID).toBe(Agent.ID)
  expect(CoreLocation.Ref).toBe(Location.Ref)
  expect(ModelV2.Ref).toBe(Model.Ref)
  expect(SessionV2.Info).toBe(Session.Info)
  expect(CoreSessionInput.Admitted).toBe(SessionInput.Admitted)
  expect(CoreSessionMessage.Message).toBe(SessionMessage.Message)
  expect(CorePrompt).toBe(Prompt)
  expect(Api.groups["server.session"].identifier).toBe("server.session")
  expect(Object.keys(ClientApi.groups)).toEqual(Object.keys(Api.groups))
  expect(Session.ID.create()).toStartWith("ses_")
  expect(Project.ID.global).toBe("global")
  expect(Provider.ID.anthropic).toBe("anthropic")
  expect(Workspace.ID.create()).toStartWith("wrk_")
})

test("client and Server contracts generate identically", () => {
  const server = compile(Api, { groupNames, endpointNames, omitEndpoints })
  const client = compile(ClientApi, { groupNames, endpointNames, omitEndpoints })

  expect(emitPromise(client)).toEqual(emitPromise(server))
})

test("shared DTO schemas construct and decode plain objects", () => {
  const made = Prompt.make({ text: "hello" })
  const decoded = Schema.decodeUnknownSync(Prompt)({ text: "hello" })
  const content = Schema.decodeUnknownSync(SessionMessage.AssistantText)({ type: "text", id: "part_1", text: "hi" })

  expect(Object.getPrototypeOf(made)).toBe(Object.prototype)
  expect(Object.getPrototypeOf(decoded)).toBe(Object.prototype)
  expect(Object.getPrototypeOf(content)).toBe(Object.prototype)
  expect(Prompt.ast.annotations?.identifier).toBe("Prompt")
  expect(SessionMessage.AssistantText.ast.annotations?.identifier).toBe("Session.Message.Assistant.Text")
  expect(CoreSessionMessage.AssistantText).toBe(SessionMessage.AssistantText)
})
