import type { DBObject, UIObject } from "../_types/types";
import { sectionReadProcessing } from "./section.processing";
// -----------------------------------------------------------------------------


export const objectReadProcessing = (dbData: DBObject): UIObject => {
  return {
    ...dbData,
    phones: dbData.phones?.map((phone) => ({...phone, uiID: crypto.randomUUID()})) ?? [],
    links: dbData.links?.map((link) => ({...link, uiID: crypto.randomUUID()})) ?? [],
    sections: dbData.objectOnSection?.map(({ section }) => sectionReadProcessing(section)) ?? [],
    usages: dbData.usages?.map((usage) => ({...usage, section: sectionReadProcessing(usage.section)})),
    options: dbData.objectOnOption?.map(({ option }) => ({...option, uiID: crypto.randomUUID()})),
    // schedule: Array(7).fill(null)
    //   .map((_, i) => ({schedule_id: -1, object_id: -1, time: "", from: 0, to: 0, day_num: i}))
    //   .map((localDay) => dbData.schedule?.find((dbDay) => dbDay.day_num === localDay.day_num) ?? localDay)
    //   .map((day) => ({ ...day, uiID: crypto.randomUUID(), isWork: Boolean(day?.time) })),
    photos: dbData.photos?.map((photo) => ({...photo, uiID: crypto.randomUUID()})) ?? [],
  }
}