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
    usages: dbData.objectUsages?.map((objectUsage) => ({
      ...objectUsage,
      ...objectUsage.usage,
      uiID: crypto.randomUUID(),
      schedules: Array(7).fill(null).map((_, i) => {
        const daySchedules = objectUsage.schedules.filter((usageSchedule) => usageSchedule.day_num === i);
        const daySchedule = daySchedules
          .toSorted((a, b) => a.object_usage_id - b.object_usage_id)
          .reduce((accum, schedule) => {
            if (typeof accum.day_num === "number") {
              return {...accum, time: `${accum.time}\n${schedule.time}`};
            } else {
              return schedule;
            }
          }, {} as UISchedule);
          return (typeof daySchedule.day_num === "number") ? daySchedule : {day_num: i}
      }, [] as UISchedule[])})) ?? [],
      // schedules: objectUsage.schedules.reduce((accum, schedule) => {
      //   let newAccum = structuredClone(accum);
      //   const accumDay = newAccum.find((day) => day.day_num === schedule.day_num);
      //   if (accumDay) {
      //     accumDay.time = `${accumDay.time}\n${schedule.time}`;
      //   } else {
      //     newAccum = [...newAccum, {...schedule, uiID: crypto.randomUUID()}];
      //   }
      //   return newAccum;
      // }, [] as UISchedule[])})) ?? [],
  }
}