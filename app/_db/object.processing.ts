import { DBObject, UIObject } from "../_types/types";
import { getEmptyObject } from "./object";
import { sectionReadProcessing } from "./section.processing";

export const objectReadProcessing = async (dbData: DBObject): Promise<UIObject> => {
  return {
    ...dbData,
    phones: dbData.phones?.map((phone) => ({ ...phone, uiID: crypto.randomUUID() })),
    links: dbData.links?.map((link) => ({ ...link, uiID: crypto.randomUUID() })),
    sections: dbData.sections?.map(({ section }) => section).map((section) => sectionReadProcessing(section)),
    options: dbData.options?.map(({ option }) => ({...option, uiID: crypto.randomUUID()})),
    schedule: (await getEmptyObject()).schedule
      .map((localDay) => dbData.schedule.find((dbDay) => dbDay.day_num === localDay.day_num ? dbDay : localDay) ?? localDay)
      .map((day) => ({ ...day, uiID: crypto.randomUUID(), isWork: Boolean(day.time) })),
    photos: dbData.photos.map((photo) => ({...photo, uiID: crypto.randomUUID()}))
  }
}