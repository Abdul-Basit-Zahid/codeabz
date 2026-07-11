import { Context } from "effect"
import type { InstanceContext } from "@/project/instance-context"
import type { WorkspaceV2 } from "@codeabz/core/workspace"

export const InstanceRef = Context.Reference<InstanceContext | undefined>("~codeabz/InstanceRef", {
  defaultValue: () => undefined,
})

export const WorkspaceRef = Context.Reference<WorkspaceV2.ID | undefined>("~codeabz/WorkspaceRef", {
  defaultValue: () => undefined,
})
