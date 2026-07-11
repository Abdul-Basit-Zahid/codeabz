/// <reference path="../markdown.d.ts" />

export * as SkillPlugin from "./skill"

import { define } from "./internal"
import { Effect } from "effect"
import { AbsolutePath } from "../schema"
import { SkillV2 } from "../skill"
import customizecodeabzContent from "./skill/customize-codeabz.md" with { type: "text" }

export const CustomizecodeabzContent = customizecodeabzContent

export const Plugin = define({
  id: "skill",
  effect: Effect.fn(function* (ctx) {
    yield* ctx.skill.transform((draft) => {
      draft.source(
        SkillV2.EmbeddedSource.make({
          type: "embedded",
          skill: SkillV2.Info.make({
            name: "customize-codeabz",
            description:
              "Use ONLY when the user is editing or creating codeabz's own configuration: codeabz.json, codeabz.jsonc, files under .codeabz/, or files under ~/.config/codeabz/. Also use when creating or fixing codeabz agents, subagents, commands, skills, plugins, MCP servers, or permission rules. Do not use for the user's own application code, or for any project that is not configuring codeabz itself.",
            location: AbsolutePath.make("/builtin/customize-codeabz.md"),
            content: CustomizecodeabzContent,
          }),
        }),
      )
    })
  }),
})
