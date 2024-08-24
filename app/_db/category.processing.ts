import type { DBCategory, ProcCategory } from "../_types/types"

export const categoryReadProcessing = (dbData:DBCategory):ProcCategory => {
  return {
    ...dbData,
    sections: dbData.categoryOnSections?.map(({section}) => section) ?? [],
  }
}