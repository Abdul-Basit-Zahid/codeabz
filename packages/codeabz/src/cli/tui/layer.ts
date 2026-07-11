import { run as runTui, type TuiInput } from "@codeabz/tui"
import { Global } from "@codeabz/core/global"
import { AppNodeBuilder } from "@codeabz/core/effect/app-node-builder"
import { Effect } from "effect"

export function run(input: TuiInput) {
  return runTui(input).pipe(Effect.provide(AppNodeBuilder.build(Global.node)))
}
