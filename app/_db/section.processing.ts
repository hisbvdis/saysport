import type { DBSection, UISection } from "@/app/_types/types"
import { specReadProcessing } from "./spec.processing"


export const sectionReadProcessing = (dbData:DBSection):UISection => {
  return {
    ...dbData,
    specs: dbData.sectionOnSpecs?.map(({spec}) => specReadProcessing(spec)) ?? [],
    uiID: crypto.randomUUID()
  }
}