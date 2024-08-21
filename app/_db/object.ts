"use server";
import { db } from "@/drizzle/client";
import { revalidatePath } from "next/cache";
import { and, between, count, desc, eq, exists, gte, ilike, inArray, isNull, lte, ne, notExists, sql } from "drizzle-orm";
import { type Object_, object_link, object, objectStatusEnum, type objectStatusUnion, objectTypeEnum, type objectTypeUnion, object_on_option, object_on_section, object_phone, object_photo, object_usage, object_schedule } from "@/drizzle/schema";
// -----------------------------------------------------------------------------
import type { DBObject, UIObject } from "../_types/types";
import { objectReadProcessing } from "./object.processing";
import type { SearchParamsType } from "../(router)/page";


export const getEmptyObject = async ():Promise<UIObject> => {
  return {
    name_type: "",
    city_id: 0,
    object_id: 0,
    coord_lat: 0,
    coord_lon: 0,
    type: objectTypeEnum.org,
    status: objectStatusEnum.works,
    sections: [],
    usages: [],
  }
}

export const getObjectsCountByFilters = async (filters?:Filters) => {
  const type = filters?.type;
  const query = filters?.query;
  const cityId = filters?.city ? Number(filters?.city) : undefined;
  const status = filters?.status?.split(",") as objectStatusUnion[];
  const photo = filters?.photo?.split(",");
  const sectionId = filters?.section ? Number(filters.section) : undefined;
  const optionIds = filters?.options ?? undefined;
  const days = filters?.days?.split(",").map((day) => Number(day)) ?? [];
  const from = filters?.from;
  const to = filters?.to;
  const groupedOptions = Object.entries(optionIds
    ? optionIds /* "1:1,1:2,!2:3" */
      .split(",") /* ["1:1"],["1:2"],["!2:3"] */
      .map((str) => str.split(":")) /* ["1":"1"],["1":"2"],["!2":"3"] */
      .reduce((acc, [key, value]) => ({...acc, [key]: acc[key] ? [...acc[key], Number(value)] : [Number(value)]}), {} as {[key:string]: number[]}) /* ['1',[1,2], ["!2",[5,6]]] */
    : {}
  )
  const dbData = await db.select({count: count()}).from(object).where(and(
    query ? ilike(sql`TRIM(CONCAT(${object.name_type}, COALESCE(NULLIF(CONCAT(' ', '«' || ${object.name_title} || '»'), ' '), ''), COALESCE(NULLIF(CONCAT(' ', ${object.name_where}), ' '), '')))` as any, `%${query}%`) : undefined,
    cityId ? eq(object.city_id, cityId) : undefined,
    type ? eq(object.type, type) : undefined,
    sectionId ? exists(db.select().from(object_on_section).where(and(eq(object.object_id, object_on_section.object_id), eq(object_on_section.section_id, sectionId)))) : undefined,
    optionIds ? and(...groupedOptions.map(([specId, optionIdArr]) => {
      if (specId.startsWith("!")) {
        return inArray(object.object_id, db.select({object_id: object_on_option.object_id}).from(object_on_option).where(inArray(object_on_option.option_id, optionIdArr)).groupBy(object_on_option.object_id).having(eq(sql`COUNT(DISTINCT ${object_on_option.option_id})`, optionIdArr.length)))
      }
      return exists(db.select().from(object_on_option).where(and(eq(object_on_option.object_id, object.object_id), inArray(object_on_option.option_id, optionIdArr))))
    })) : undefined,
    status ? inArray(object.status, status) : undefined,
    photo?.length === 1 ? photo[0] === "true" ? exists(db.select().from(object_photo).where(eq(object_photo.object_id, object.object_id))) : notExists(db.select().from(object_photo).where(eq(object_photo.object_id, object.object_id))) : undefined,
    days.length || from || to ? exists(db.select().from(object_schedule).where(and(eq(object_schedule.object_id, object.object_id), days.length ? inArray(object_schedule.day_num, days) : undefined, from ? gte(object_schedule.from, Number(from)) : undefined, to ? lte(object_schedule.to, Number(to)) : undefined))) : undefined,
  ))
  return dbData;
}

export const getObjectsByFilters = async (filters?:Filters):Promise<DBObject[]> => {
  const type = filters?.type;
  const query = filters?.query;
  const cityId = filters?.city ? Number(filters?.city) : undefined;
  const status = filters?.status?.split(",") as objectStatusUnion[];
  const photo = filters?.photo?.split(",");
  const page = filters?.page;
  const limit = filters?.limit;
  const sectionId = filters?.section ? Number(filters.section) : undefined;
  const optionIds = filters?.options ?? undefined;
  const days = filters?.days?.split(",").map((day) => Number(day)) ?? [];
  const from = filters?.from;
  const to = filters?.to;
  const groupedOptions = Object.entries(optionIds
    ? optionIds /* "1:1,1:2,!2:3" */
      .split(",") /* ["1:1"],["1:2"],["!2:3"] */
      .map((str) => str.split(":")) /* ["1":"1"],["1":"2"],["!2":"3"] */
      .reduce((acc, [key, value]) => ({...acc, [key]: acc[key] ? [...acc[key], Number(value)] : [Number(value)]}), {} as {[key:string]: number[]}) /* ['1',[1,2], ["!2",[5,6]]] */
    : {}
  )
  const dbData = await db.query.object.findMany({
    where: and(
      query ? ilike(sql`TRIM(CONCAT(${object.name_type}, COALESCE(NULLIF(CONCAT(' ', '«' || ${object.name_title} || '»'), ' '), ''), COALESCE(NULLIF(CONCAT(' ', ${object.name_where}), ' '), '')))` as any, `%${query}%`) : undefined,
      cityId ? eq(object.city_id, cityId) : undefined,
      type ? eq(object.type, type) : undefined,
      sectionId ? exists(db.select().from(object_on_section).where(and(eq(object.object_id, object_on_section.object_id), eq(object_on_section.section_id, sectionId)))) : undefined,
      optionIds ? and(...groupedOptions.map(([specId, optionIdArr]) => {
        if (specId.startsWith("!")) {
          return inArray(object.object_id, db.select({object_id: object_on_option.object_id}).from(object_on_option).where(inArray(object_on_option.option_id, optionIdArr)).groupBy(object_on_option.object_id).having(eq(sql`COUNT(DISTINCT ${object_on_option.option_id})`, optionIdArr.length)))
        }
        return exists(db.select().from(object_on_option).where(and(eq(object_on_option.object_id, object.object_id), inArray(object_on_option.option_id, optionIdArr))))
      })) : undefined,
      status ? inArray(object.status, status) : undefined,
      photo?.length === 1 ? photo[0] === "true" ? exists(db.select().from(object_photo).where(eq(object_photo.object_id, object.object_id))) : notExists(db.select().from(object_photo).where(eq(object_photo.object_id, object.object_id))) : undefined,
      days.length || from || to ? exists(db.select().from(object_schedule).where(and(eq(object_schedule.object_id, object.object_id), days.length ? inArray(object_schedule.day_num, days) : undefined, from ? gte(object_schedule.from, Number(from)) : undefined, to ? lte(object_schedule.to, Number(to)) : undefined))) : undefined,
    ),
    with: {
      // statusInstead: true,
      city: true,
      // parent: true,
      // phones: {orderBy: (phones, { asc }) => [asc(phones.order)]},
      // links: {orderBy: (links, { asc }) => [asc(links.order)]},
      objectOnOptions: {with: {option: true}},
      photos: {orderBy: (photos, { asc }) => [asc(photos.order)]},
      objectOnSections: {with: {section: {with: {sectionOnSpecs: {with: {spec: {with: {options: true}}}}}}}},
      // objectSchedules: true,
    },
    orderBy: [desc(object.created)],
    limit: limit,
    offset: page ? (Number(page) - 1) * 10 : undefined
  });
  return dbData;
}

interface Filters extends SearchParamsType {
  type?:objectTypeUnion;
  limit?:number;
}

export const getObjectsByArea = async (latMin:number, latMax:number, lonMin:number, lonMax:number, currentObjectId?:number, parentObjectId?:number|null):Promise<Object_[]> => {
  const dbData:Object_[]|undefined = await db.query.object.findMany({
    where: and(
      between(object.coord_lat, latMin, latMax),
      between(object.coord_lon, lonMin, lonMax),
      isNull(object.parent_id),
      currentObjectId ? ne(object.object_id, currentObjectId) : undefined,
      parentObjectId ? ne(object.object_id, parentObjectId) : undefined,
    )
  });
  if (dbData === undefined) throw new Error("getObjectsByArea returned undefined");
  return dbData;
}

export const getObjectById = async (id:number):Promise<UIObject> => {
  const dbData = await db.query.object.findFirst({
    where: eq(object.object_id, id),
    with: {
      statusInstead: true,
      city: true,
      parent: {with: {objectUsages: {with: {usage: true, schedules: true}}}},
      phones: {orderBy: (phones, { asc }) => [asc(phones.order)]},
      links: {orderBy: (links, { asc }) => [asc(links.order)]},
      objectOnOptions: {with: {option: true}},
      photos: {orderBy: (photos, { asc }) => [asc(photos.order)]},
      objectOnSections: {with: {section: {with: {sectionOnSpecs: {with: {spec: {with: {options: true}}}}}}}},
      objectUsages: {with: {usage: true, schedules: true}},
      // -----------------------------------------------------------------------------
      children: {
        orderBy: (child, {asc}) => [asc(child.name_type)],
        with: {photos: true, phones: true, links: true, objectUsages: {with: {usage: true, schedules: true}}}
      },
    }
  }) satisfies DBObject|undefined;
  if (dbData === undefined) throw new Error("getObjectById returned undefined");
  const processed = objectReadProcessing(dbData);
  return processed;
}

export const deleteObjectById = async (id:number) => {
  await db.delete(object).where(eq(object.object_id, id));
  revalidatePath(`object/${id}`, "page");
}

export const upsertObject = async (state:UIObject, init: UIObject): Promise<Object_> => {
  const fields = {
    object_id: state.object_id || undefined,
    name_type: state.name_type,
    name_title: state.name_title,
    name_locative: state.name_locative || null,
    name_where: state.name_where || null,
    type: state.type,
    status: state.status,
    status_inherit: state.status_inherit || null,
    status_comment: state.status_comment || null,
    status_source: state.status_source || null,
    status_instead_id: state.status_instead_id || null,
    city_id: state.city_id,
    parent_id: state.parent_id || null,
    address: state.address || null,
    address_2: state.address_2 || null,
    coord_inherit: state.coord_inherit || null,
    coord_lat: state.coord_lat,
    coord_lon: state.coord_lon,
    description: state.description || null,
    created: state.created ? state.created : new Date(),
  };


  const [ upsertedObject ] = await db.insert(object).values(fields).onConflictDoUpdate({target: object.object_id, set: {...fields}}).returning();
  const children:DBObject[] = await db.query.object.findMany({where: eq(object.parent_id, upsertedObject.object_id), with: {objectUsages: {with: {usage: true, schedules: true}}}});

  const nameTitleIsChanged = state.name_title !== init.name_title;
  if (nameTitleIsChanged) {
    children.length && children.forEach(async (child) => await db.update(object).set({name_where: state.name_locative?.concat(state.name_title ? ` «${state.name_title}»` : "")}).where(eq(object.object_id, child.object_id)));
  }
  const coordsIsChanged = state.coord_lat !== init.coord_lat || state.coord_lon !== init.coord_lon;
  if (coordsIsChanged) {
    children.length && children.filter((child) => child.coord_inherit).forEach(async (child) => await db.update(object).set({coord_lat: upsertedObject.coord_lat, coord_lon: upsertedObject.coord_lon}).where(eq(object.object_id, child.object_id)));
  }
  const statusIsChanged = state.status !== init.status || state.status_comment !== init.status_comment || state.status_source !== init.status_source || state.status_instead_id !== init.status_instead_id;
  if (statusIsChanged) {
    children.length && children.filter((child) => child.status_inherit).forEach(async (child) => await db.update(object).set({status: state.status, status_comment: state.status_comment, status_source: state.status_source, status_instead_id: state.status_instead_id}).where(eq(object.object_id, child.object_id)));
  }

  const phonesAdded = state.phones?.filter((statePhone) => !init?.phones?.some((initPhone) => statePhone.order === initPhone.order) && statePhone.value !== "");
  if (phonesAdded?.length) {
    await db.insert(object_phone).values(phonesAdded.map((addedPhone) => ({...addedPhone, object_id: upsertedObject.object_id})));
    children.length && children.forEach(async (child) => await db.insert(object_phone).values(phonesAdded.map((addedPhone) => ({...addedPhone, object_id: child.object_id}))));
  }
  const phonesChanged = state.phones?.filter((statePhone) => init.phones?.some((initPhone) => statePhone.order === initPhone.order && (statePhone.value !== initPhone.value || statePhone.comment !== initPhone.comment)));
  if (phonesChanged?.length) {
    phonesChanged.forEach(async (changedPhone) => await db.update(object_phone).set({...changedPhone, object_id: undefined}).where(and(eq(object_phone.object_id, upsertedObject.object_id), eq(object_phone.order, changedPhone.order))));
    children.length && children.forEach(async (child) => phonesChanged.forEach(async (changedPhone) => await db.update(object_phone).set({...changedPhone, object_id: undefined}).where(and(eq(object_phone.object_id, child.object_id), eq(object_phone.order, changedPhone.order)))));
  }
  const phonesDeleted = init.phones?.filter((initPhone) => !state.phones?.some((statePhone) => initPhone.order === statePhone.order));
  if (phonesDeleted?.length) {
    await db.delete(object_phone).where(and(eq(object_phone.object_id, upsertedObject.object_id), inArray(object_phone.order, phonesDeleted.map((deletedPhone) => deletedPhone.order))));
    children.length && children.forEach(async (child) => phonesDeleted.forEach(async () => await db.delete(object_phone).where(and(eq(object_phone.object_id, child.object_id), inArray(object_phone.order, phonesDeleted.map((deletedPhone) => deletedPhone.order))))));
  }

  const linksAdded = state.links?.filter((stateLink) => !init?.links?.some((initLink) => stateLink.order === initLink.order) && stateLink.value !== "");
  if (linksAdded?.length) {
    await db.insert(object_link).values(linksAdded.map((addedLink) => ({...addedLink, object_id: upsertedObject.object_id})));
    children.length && children.forEach(async (child) => await db.insert(object_link).values(linksAdded.map((addedLink) => ({...addedLink, object_id: child.object_id}))));
  }
  const linksChanged = state.links?.filter((stateLink) => init.links?.some((initLink) => stateLink.order === initLink.order && (stateLink.value !== initLink.value || stateLink.comment !== initLink.comment)));
  if (linksChanged?.length) {
    linksChanged.forEach(async (changedLink) => await db.update(object_link).set({...changedLink, object_id: undefined}).where(and(eq(object_link.object_id, upsertedObject.object_id), eq(object_link.order, changedLink.order))));
    children.length && children.forEach(async (child) => linksChanged.forEach(async (changedLink) => await db.update(object_link).set({...changedLink, object_id: undefined}).where(and(eq(object_link.object_id, child.object_id), eq(object_link.order, changedLink.order)))));
  }
  const linksDeleted = init.links?.filter((initLink) => !initLink.value || !state.links?.some((stateLink) => initLink.order === stateLink.order));
  if (linksDeleted?.length) {
    await db.delete(object_link).where(and(eq(object_link.object_id, upsertedObject.object_id), inArray(object_link.order, linksDeleted.map((deletedLink) => deletedLink.order))));
    children.length && children.forEach(async (child) => linksDeleted.forEach(async () => await db.delete(object_link).where(and(eq(object_link.object_id, child.object_id), inArray(object_link.order, linksDeleted.map((deletedLink) => deletedLink.order))))));
  }

  const sectionsAdded = state.sections?.filter((stateSection) => !init?.sections?.some((initSection) => stateSection.section_id === initSection.section_id));
  if (sectionsAdded?.length) {
    await db.insert(object_on_section).values(sectionsAdded.map((section) => ({...section, object_id: upsertedObject.object_id})));
  }
  const sectionsDeleted = init.sections?.filter((initSection) => !state.sections?.some((stateSection) => initSection.section_id === stateSection.section_id));
  if (sectionsDeleted?.length) {
    await db.delete(object_on_section).where(and(eq(object_on_section.object_id, upsertedObject.object_id), inArray(object_on_section.section_id, sectionsDeleted.map((section) => section.section_id))));
  }

  const optionsAdded = state.options?.filter((stateOption) => !init?.options?.some((initOption) => stateOption.option_id === initOption.option_id));
  if (optionsAdded?.length) {
    await db.insert(object_on_option).values(optionsAdded.map((option) => ({...option, object_id: upsertedObject.object_id})));
  }
  const optionsDeleted = init.options?.filter((initOption) => !state.options?.some((stateOption) => initOption.option_id === stateOption.option_id));
  if (optionsDeleted?.length) {
    await db.delete(object_on_option).where(and(eq(object_on_option.object_id, upsertedObject.object_id), inArray(object_on_option.option_id, optionsDeleted.map((opt) => opt.option_id))));
  }

  const usagesAdded = state.usages?.filter((stateUsage) => !init?.usages?.some((initUsage) => stateUsage.uiID === initUsage.uiID));
  if (usagesAdded.length) {
    usagesAdded.forEach(async (usage) => {
      const [upsertedUsage] = await db.insert(object_usage).values({...usage, object_id: upsertedObject.object_id}).returning({object_usage_id: object_usage.object_usage_id});
      if (usage.schedules?.length) {
        await db.insert(object_schedule).values(usage.schedules.flatMap((schedule, i) => schedule.time.split("\n").map((time) => ({object_id: upsertedObject.object_id, object_usage_id: upsertedUsage.object_usage_id, day_num: schedule.day_num, time: time, from: 0, to: 1}))));
      }
    })
  }
  state.usages.forEach(async (stateUsage) => {
    const initUsage = init.usages.find((initUsage) => initUsage.uiID === stateUsage.uiID);
    if (!initUsage) return;
    const usagesDataChanged = state.usages.filter((stateUsage) => init.usages.some((initUsage) => stateUsage.uiID === initUsage.uiID && (stateUsage.description !== initUsage.description || stateUsage.cost !== initUsage.cost || stateUsage.schedule_inherit !== initUsage.schedule_inherit)));
    if (usagesDataChanged.length)  {
      await db.update(object_usage).set(stateUsage).where(eq(object_usage.object_usage_id, stateUsage.object_usage_id));
    }
    const usageScheduleChanged = stateUsage.schedules.filter((stateSchedule) => !stateSchedule.time || initUsage.schedules.some((initSchedule) => stateSchedule.day_num === initSchedule.day_num && stateSchedule.time !== initSchedule.time));
    await db.delete(object_schedule).where(and(eq(object_schedule.object_usage_id, stateUsage.object_usage_id), inArray(object_schedule.day_num, usageScheduleChanged.map((schedule) => schedule.day_num))));
    if (usageScheduleChanged.filter((schedule) => schedule.time).length) {
      await db.insert(object_schedule).values(usageScheduleChanged.filter((schedule) => schedule.time).flatMap((schedule, i) => schedule.time.split("\n").map((time) => ({object_id: upsertedObject.object_id, object_usage_id: stateUsage.object_usage_id, day_num: schedule.day_num, time: time, from: 0, to: 1}))));
    }
  })
  const usagesDeleted = init.usages?.filter((initUsage) => !state.usages?.some((stateUsage) => initUsage.uiID === stateUsage.uiID));
  if (usagesDeleted.length) {
    await db.delete(object_usage).where(inArray(object_usage.object_usage_id, usagesDeleted.map((deletedUsage) => deletedUsage.object_usage_id)));
  }

  const photosAdded = state.photos?.filter((statePhoto) => !init?.photos?.some((initPhoto) => statePhoto.uiID === initPhoto.uiID));
  if (photosAdded?.length) {
    await db.insert(object_photo).values(photosAdded.map((photo) => ({...photo, photo_id:undefined, name: photo.name.replace("ID", String(upsertedObject.object_id)), object_id: upsertedObject.object_id})));
  }
  const photosChanged = state.photos?.filter((statePhoto) => init?.photos?.some((initPhoto) => statePhoto.uiID === initPhoto.uiID && statePhoto.order !== initPhoto.order));
  if (photosChanged?.length) {
    photosChanged.forEach(async (photo) => await db.update(object_photo).set({order: photo.order}).where(eq(object_photo.photo_id, photo.photo_id)));
  }
  const photosDeleted = init.photos?.filter((initPhoto) => !state.photos?.some((statePhoto) => initPhoto.uiID === statePhoto.uiID));
  if (photosDeleted?.length) {
    await db.delete(object_photo).where(and(eq(object_photo.object_id, upsertedObject.object_id), inArray(object_photo.order, photosDeleted.map((photo) => photo.order))));
  }

  revalidatePath(`object/${upsertedObject.object_id}`, "page");
  return upsertedObject;
}