export * as File from "./file"

import { Revert } from "@codeabz/schema/revert"

export const Diff = Revert.FileDiff
export type Diff = typeof Diff.Type
