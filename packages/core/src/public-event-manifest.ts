export * as PublicEventManifest from "./public-event-manifest"

import { Event } from "@codeabz/schema/event"
import { EventManifest } from "@codeabz/schema/event-manifest"

export const Definitions = EventManifest.ServerDefinitions
export const Latest = Event.latest(Definitions)
