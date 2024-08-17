import type { DBCategory, UICategory } from "../_types/types"

export const categoryReadProcessing = (dbData:DBCategory):UICategory => {
  return {
    ...dbData,
    sections: dbData.categoryOnSections?.map(({section}) => section) ?? [],
  }
}