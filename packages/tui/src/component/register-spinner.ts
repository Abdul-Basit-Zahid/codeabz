import { getComponentCatalogue } from "@opentui/solid/components"
import { registerSpinner } from "opentui-spinner/solid"

export function registercodeabzSpinner() {
  if (!getComponentCatalogue().spinner) registerSpinner()
}
