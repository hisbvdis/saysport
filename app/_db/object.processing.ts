import type { DBObject, UIObject, UISchedule } from "../_types/types";
import { sectionReadProcessing } from "./section.processing";
// -----------------------------------------------------------------------------


export const objectReadProcessing = (dbData: DBObject): UIObject => {
  return {
    ...dbData,
    phones: dbData.phones?.map((phone) => ({...phone, uiID: crypto.randomUUID()})) ?? [],
    links: dbData.links?.map((link) => ({...link, uiID: crypto.randomUUID()})) ?? [],
    sections: dbData.objectOnSection?.map(({section}) => sectionReadProcessing(section)) ?? [],
    options: dbData.objectOnOption?.map(({ option }) => ({...option, uiID: crypto.randomUUID()})) ?? [],
    photos: dbData.photos?.map((photo) => ({...photo, uiID: crypto.randomUUID()})) ?? [],
    parent: dbData.parent ? objectReadProcessing(dbData.parent) : null,
    usages: dbData.objectOnUsage?.map((objectOnUsage) => ({...objectOnUsage, ...objectOnUsage.usage, uiID: crypto.randomUUID()})) ?? [],
    schedules: dbData.objectSchedule
      ?.map((objectSchedule) => ({...objectSchedule, times: []}))
      .reduce((accum, schedule) => {
        const scheduleItem = accum.find((accumSchedule) => accumSchedule.usage_id === schedule.usage_id && accumSchedule.day_num === schedule.day_num);
        if (scheduleItem) {
          scheduleItem.times = scheduleItem.times.concat(schedule.time);
          scheduleItem.froms = scheduleItem.froms.concat(schedule.from);
          scheduleItem.tos = scheduleItem.tos.concat(schedule.to);
          return accum;
        }
        return accum.concat({...schedule, times: [schedule.time], froms: [schedule.from], tos: [schedule.to], time: "", isWork: Boolean(schedule.time)})
      }, [] as UISchedule[]) ?? [],
  }
}