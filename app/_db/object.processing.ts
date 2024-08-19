import type { DBObject, UIObject } from "../_types/types";
// -----------------------------------------------------------------------------
import { sectionReadProcessing } from "./section.processing";
// -----------------------------------------------------------------------------


export const objectReadProcessing = (dbData: DBObject): UIObject => {
  const usageIds = dbData.objectUsages?.map((usage) => ({object_usage_id: usage.object_usage_id, uiID: crypto.randomUUID()}))
  return {
    ...dbData,
    phones: dbData.phones?.map((phone) => ({...phone, uiID: crypto.randomUUID()})) ?? [],
    links: dbData.links?.map((link) => ({...link, uiID: crypto.randomUUID()})) ?? [],
    sections: dbData.objectOnSections?.map(({section}) => sectionReadProcessing(section)) ?? [],
    options: dbData.objectOnOptions?.map(({ option }) => ({...option, uiID: crypto.randomUUID()})) ?? [],
    photos: dbData.photos?.map((photo) => ({...photo, uiID: crypto.randomUUID()})) ?? [],
    parent: dbData.parent ? objectReadProcessing(dbData.parent) : null,
    usages: dbData.objectUsages?.map((objectUsage) => ({...objectUsage, ...objectUsage.usage, uiID: usageIds?.find((usage) => usage.object_usage_id === objectUsage.object_usage_id)?.uiID ?? ""})) ?? [],
    schedules: dbData.objectSchedules?.map((objectSchedule) => ({...objectSchedule, uiID: crypto.randomUUID(), usageUIID: usageIds?.find((usage) => usage.object_usage_id === objectSchedule.object_usage_id)?.uiID ?? ""})) ?? [],
  }
}