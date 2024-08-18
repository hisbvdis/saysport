import type { DBObject, UIObject, UISchedule } from "../_types/types";
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
    usages: dbData.objectUsages?.map((objectUsage) => ({...objectUsage, ...objectUsage.usageName, uiID: crypto.randomUUID()})) ?? [],
    // schedules: dbData.objectSchedules
    //   ?.map((objectSchedule) => ({...objectSchedule, times: []}))
    //   .reduce((accum, schedule) => {
    //     const scheduleItem = accum.find((accumSchedule) => accumSchedule.usage_id === schedule.usage_id && accumSchedule.day_num === schedule.day_num);
    //     if (scheduleItem) {
    //       scheduleItem.times = scheduleItem.times.concat(schedule.time);
    //       scheduleItem.froms = scheduleItem.froms.concat(schedule.from);
    //       scheduleItem.tos = scheduleItem.tos.concat(schedule.to);
    //       scheduleItem.scheduleIds = scheduleItem.scheduleIds.concat(schedule.schedule_id);
    //       return accum;
    //     }
    //     return accum.concat({...schedule, times: [schedule.time], froms: [schedule.from], tos: [schedule.to], time: "", isWork: Boolean(schedule.time), scheduleIds: [schedule.schedule_id]})
    //   }, [] as UISchedule[])
    //   ?? [],
    schedules: dbData.objectSchedules?.map((objectSchedule) => ({...objectSchedule, isWork: true, uiID: crypto.randomUUID()})) ?? [],
  }
}