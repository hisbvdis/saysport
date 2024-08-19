import type { DBObject, UIObject, UISchedule } from "../_types/types";
// -----------------------------------------------------------------------------
import { sectionReadProcessing } from "./section.processing";
// -----------------------------------------------------------------------------


export const objectReadProcessing = (dbData: DBObject): UIObject => {
  return {
    ...dbData,
    phones: dbData.phones?.map((phone) => ({...phone, uiID: crypto.randomUUID()})) ?? [],
    links: dbData.links?.map((link) => ({...link, uiID: crypto.randomUUID()})) ?? [],
    sections: dbData.objectOnSections?.map(({section}) => sectionReadProcessing(section)) ?? [],
    options: dbData.objectOnOptions?.map(({ option }) => ({...option, uiID: crypto.randomUUID()})) ?? [],
    photos: dbData.photos?.map((photo) => ({...photo, uiID: crypto.randomUUID()})) ?? [],
    parent: dbData.parent ? objectReadProcessing(dbData.parent) : null,
    usages: dbData.objectUsages?.map((objectUsage) => ({...objectUsage, ...objectUsage.usage, uiID: crypto.randomUUID(), schedules: objectUsage.schedules.reduce((accum, schedule) => {
      let newAccum = structuredClone(accum);
      const accumDay = newAccum.find((day) => day.day_num === schedule.day_num);
      if (accumDay) {
        accumDay.time = `${accumDay.time}\n${schedule.time}`;
      } else {
        newAccum = [...newAccum, {...schedule, uiID: crypto.randomUUID()}];
      }
      return newAccum;
    }, [] as UISchedule[])})) ?? [],
  }
}