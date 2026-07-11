import { AgentV2 } from "@codeabz/core/agent"
import { AISDK } from "@codeabz/core/aisdk"
import { Catalog } from "@codeabz/core/catalog"
import { CommandV2 } from "@codeabz/core/command"
import { Credential } from "@codeabz/core/credential"
import { AppNodeBuilder } from "@codeabz/core/effect/app-node-builder"
import { LayerNodePlatform } from "@codeabz/core/effect/app-node-platform"
import { LayerNode } from "@codeabz/core/effect/layer-node"
import { EventV2 } from "@codeabz/core/event"
import { FileSystem } from "@codeabz/core/filesystem"
import { FSUtil } from "@codeabz/core/fs-util"
import { Integration } from "@codeabz/core/integration"
import { Location } from "@codeabz/core/location"
import { Npm } from "@codeabz/core/npm"
import { PluginV2 } from "@codeabz/core/plugin"
import { Reference } from "@codeabz/core/reference"
import { SkillV2 } from "@codeabz/core/skill"
import { Effect, Layer } from "effect"
import { tempLocationLayer } from "../fixture/location"

const npmLayer = Layer.succeed(
  Npm.Service,
  Npm.Service.of({
    add: () => Effect.succeed({ directory: "", entrypoint: undefined }),
    install: () => Effect.void,
    which: () => Effect.succeed(undefined),
  }),
)

export const PluginTestLayer = AppNodeBuilder.build(
  LayerNode.group([
    FileSystem.node,
    FSUtil.node,
    Location.node,
    Npm.node,
    Credential.node,
    EventV2.node,
    LayerNodePlatform.httpClient,
    PluginV2.node,
    AgentV2.node,
    AISDK.node,
    Catalog.node,
    CommandV2.node,
    Integration.node,
    Reference.node,
    SkillV2.node,
  ]),
  [
    [Location.node, tempLocationLayer],
    [Npm.node, npmLayer],
  ],
)
