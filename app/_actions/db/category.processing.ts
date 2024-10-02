import type { DBCategory, ProcessedDBCategory } from "@/app/_types/db"


export const categoryReadProcessing = (dbData:DBCategory):ProcessedDBCategory => {
  return {
    ...dbData,
    sections: dbData.categoryOnSections?.map(({section}) => section) ?? [],
  }
}