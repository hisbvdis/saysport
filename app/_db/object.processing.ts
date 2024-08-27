import { nanoid } from "nanoid";
import type { DBObject, ProcObject, ProcObjectSchedule } from "../_types/types";
// -----------------------------------------------------------------------------
import { sectionReadProcessing } from "./section.processing";
// -----------------------------------------------------------------------------


export const objectReadProcessing = (dbData: DBObject): ProcObject => {
  return {
    ...dbData,
    phones: dbData.phones?.map((phone) => ({...phone, uiID: nanoid()})) ?? [],
    links: dbData.links?.map((link) => ({...link, uiID: nanoid()})) ?? [],
    sections: dbData.objectOnSections?.map(({section}) => sectionReadProcessing(section)) ?? [],
    options: dbData.objectOnOptions?.map(({ option }) => ({...option, uiID: nanoid()})) ?? [],
    photos: dbData.photos?.map((photo) => ({...photo, uiID: nanoid()})) ?? [],
    parent: dbData.parent ? objectReadProcessing(dbData.parent) : null,
    usages: dbData.objectOnUsages?.map((objectOnUsage) => ({
      ...objectOnUsage,
      ...objectOnUsage.usage,
      uiID: nanoid(),
      schedules: Array(7).fill(null).map((_, i) => {
        const daySchedules = objectOnUsage.schedules.filter((usageSchedule) => usageSchedule.day_num === i);
        const day = daySchedules
          .toSorted((a, b) => a.object_on_usage_id - b.object_on_usage_id)
          .reduce((accum, schedule) => {
            if (typeof accum.day_num === "number") {
              return {...accum, time: `${accum.time}\n${schedule.time}`};
            } else {
              return schedule;
            }
          }, {} as ProcObjectSchedule);
        return (typeof day.day_num === "number") ? { ...day, uiID: nanoid() } : { day_num: i, uiID: nanoid(), object_id: objectOnUsage.object_id, object_on_usage_id: objectOnUsage.object_on_usage_id, schedule_id: -1, time: "", from: 0, to: 0 };
      })
    })) ?? [],
  }
}