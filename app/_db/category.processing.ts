import type { DBCategory, UICategory } from "../_types/types"

export const categoryReadProcessing = (dbData:DBCategory):UICategory => {
  return {
    ...dbData,
    sections: dbData.categoryOnSection?.map(({section}) => section) ?? [],
  }
}