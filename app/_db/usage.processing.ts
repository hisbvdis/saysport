import type { DBSection, UISection } from "../_types/types"
import { specReadProcessing } from "./spec.processing"

export const usageReadProcessing = (dbData:DBSection):UISection => {
  return {
    ...dbData,
    specs: dbData.sectionOnSpecs?.map(({spec}) => specReadProcessing(spec)) ?? [],
    uiID: crypto.randomUUID()
  }
}