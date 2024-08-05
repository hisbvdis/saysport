import type { DBObject, UIObject } from "../_types/types";
import { sectionReadProcessing } from "./section.processing";
// -----------------------------------------------------------------------------


export const objectReadProcessing = (dbData: DBObject): UIObject => {
  return {
    ...dbData,
    phones: dbData.phones?.map((phone) => ({...phone, uiID: crypto.randomUUID()})) ?? [],
    links: dbData.links?.map((link) => ({...link, uiID: crypto.randomUUID()})) ?? [],
    sections: dbData.objectOnSection?.map(({ section }) => sectionReadProcessing(section)) ?? [],
    options: dbData.objectOnOption?.map(({ option }) => ({...option, uiID: crypto.randomUUID()})),
    photos: dbData.photos?.map((photo) => ({...photo, uiID: crypto.randomUUID()})) ?? [],
    schedules: dbData.schedules?.map((day) => ({...day, isWork: Boolean(day.time)})) ?? [],
  }
}