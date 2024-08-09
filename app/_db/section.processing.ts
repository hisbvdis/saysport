import type { DBSection, UISection } from "@/app/_types/types"
import { specReadProcessing } from "./spec.processing"


export const sectionReadProcessing = (dbData:DBSection):UISection => {
  return {
    ...dbData,
    specs: dbData.sectionOnSpec?.map(({spec}) => specReadProcessing(spec)) ?? [],
    usages: dbData.sectionOnUsage?.map(({usage}) => sectionReadProcessing(usage)) ?? [],
    uiID: crypto.randomUUID()
  }
}