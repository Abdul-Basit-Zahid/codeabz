interface ImportMetaEnv {
  readonly CODEABZ_CHANNEL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module "virtual:codeabz-server" {
  export namespace Server {
    export const listen: typeof import("../../../codeabz/dist/types/src/node").Server.listen
    export type Listener = import("../../../codeabz/dist/types/src/node").Server.Listener
  }
  export namespace Config {
    export const get: typeof import("../../../codeabz/dist/types/src/node").Config.get
    export type Info = import("../../../codeabz/dist/types/src/node").Config.Info
  }
  export const bootstrap: typeof import("../../../codeabz/dist/types/src/node").bootstrap
}
