import { nanoid } from "nanoid";
import type { DBSpec, ProcSpec } from "@/app/_types/types";


export const specReadProcessing = (dbData:DBSpec):ProcSpec => {
  return {
    ...dbData,
    options: dbData.options.map((option) => ({...option, uiID: nanoid()})),
    uiID: nanoid(),
  }
}