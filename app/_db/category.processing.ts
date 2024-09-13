import type { DBCategory, ProcessedCategory } from "../_types/types"

export const categoryReadProcessing = (dbData:DBCategory):ProcessedCategory => {
  return {
    ...dbData,
    sections: dbData.categoryOnSections?.map(({section}) => section) ?? [],
  }
}