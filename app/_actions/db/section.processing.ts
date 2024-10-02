import type { DBSection, ProcessedDBSection } from "@/app/_types/db"
import { specReadProcessing } from "./spec.processing"


export const sectionReadProcessing = (dbData:DBSection):ProcessedDBSection => {
  return {
    ...dbData,
    specs: dbData.sectionOnSpecs?.map(({spec}) => specReadProcessing(spec)) ?? [],
    usages: dbData.sectionOnUsages?.map((sectionOnUsage) => ({...sectionOnUsage, ...sectionOnUsage.usage})) ?? [],
    uiID: crypto.randomUUID()
  }
}