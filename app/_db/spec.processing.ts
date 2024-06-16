import { DBSpec, UISpec } from "@/app/_types/types";


export const specReadProcessing = (dbData:DBSpec):UISpec => {
  return {
    ...dbData,
    options: dbData?.options?.map((option) => ({...option, uiID: crypto.randomUUID()})),
    uiID: crypto.randomUUID(),
  }
}