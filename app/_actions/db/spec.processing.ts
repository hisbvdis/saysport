import type { DBSpec, ProcessedDBSpec } from "@/app/_types/db";


export const specReadProcessing = (dbData:DBSpec):ProcessedDBSpec => {
  return {
    ...dbData,
    options: dbData.options.map((option) => ({...option, uiID: crypto.randomUUID()})),
    uiID: crypto.randomUUID(),
  }
}