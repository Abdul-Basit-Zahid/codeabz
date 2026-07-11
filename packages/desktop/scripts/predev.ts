import { $ } from "bun"

await $`bun ./scripts/copy-icons.ts ${process.env.CODEABZ_CHANNEL ?? "dev"}`

await $`cd ../codeabz && bun script/build-node.ts`
