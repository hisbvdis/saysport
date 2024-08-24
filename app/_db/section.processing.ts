import type { DBSection, ProcSection } from "@/app/_types/types"
import { specReadProcessing } from "./spec.processing"


export const sectionReadProcessing = (dbData:DBSection):ProcSection => {
  return {
    ...dbData,
    specs: dbData.sectionOnSpecs?.map(({spec}) => specReadProcessing(spec)) ?? [],
    usages: dbData.sectionOnUsages?.map((sectionOnUsage) => ({...sectionOnUsage, ...sectionOnUsage.usage})) ?? [],
    uiID: crypto.randomUUID()
  }
}