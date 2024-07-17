"use server";
import { db } from "@/drizzle/client";
import { and, eq, ilike, inArray } from "drizzle-orm";
import { type Object_, object, objectStatusEnum, objectTypeEnum, type objectTypeUnion, object_link, object_on_option, object_on_section, object_phone, object_photo, object_schedule, option } from "@/drizzle/schema";
// -----------------------------------------------------------------------------
import type { UIObject } from "../_types/types";
import { objectReadProcessing } from "./object.processing";
import type { SearchParamsType } from "../(router)/catalog/page";


export const getEmptyObject = async ():Promise<UIObject> => {
  return {
    name: "",
    city_id: 0,
    object_id: 0,
    type: objectTypeEnum.org,
    status: objectStatusEnum.works,
    schedule: Array(7).fill(null).map((_,i) => ({ object_id: 0, day_num: i, time: "", from: 0, to: 0, uiID: crypto.randomUUID(), isWork: false })),
  }
}

export const getObjectsWIthPayloadByFilters = async (filters?:Filters) => {
  const type = filters?.type;
  const query = filters?.query;
  const cityId = filters?.city ? Number(filters?.city) : undefined;
  const sectionId = filters?.section ? Number(filters.section) : undefined;
  const optionIds = filters?.options ?? undefined;
  const groupedOptions = Object.entries(optionIds
    ? optionIds /* "1:1,1:2,!2:3" */
      .split(",") /* ["1:1"],["1:2"],["!2:3"] */
      .map((str) => str.split(":")) /* ["1":"1"],["1":"2"],["!2":"3"] */
      .reduce((acc, [key, value]) => ({...acc, [key]: acc[key] ? [...acc[key], Number(value)] : [Number(value)]}), {} as {[key:string]: number[]}) /* ['1',[1,2], ["!2",[5,6]]] */
    : {}
  )
  const objectsWithSectionId = sectionId ? (await db.select({id: object_on_section.object_id}).from(object_on_section).where(eq(object_on_section.section_id, sectionId))).map(({id}) => id) : undefined;
  const objectsWithOptionId = groupedOptions.length ? (await db.select({id: object_on_option.object_id}).from(object_on_option).where(inArray(object_on_option.option_id, groupedOptions[0][1]))).map(({id}) => id) : undefined
  const dbData = await db.query.object.findMany({
    where: and(
      query ? ilike(object.name, `%${query}%`) : undefined,
      cityId ? eq(object.city_id, cityId) : undefined,
      type ? eq(object.type, type) : undefined,
      (sectionId && objectsWithSectionId?.length) ? inArray(object.object_id, objectsWithSectionId) : undefined,
      (optionIds && objectsWithOptionId?.length) ? inArray(object.object_id, objectsWithOptionId) : undefined
    ),
    with: {
      statusInstead: true,
      city: true,
      parent: true,
      phones: true,
      links: true,
      objectOnOption: {with: {option: true}},
      schedule: true,
      photos: true,
      objectOnSection: {with: {section: {with: {sectionOnSpec: {with: {spec: {with: {options: true}}}}}}}},
    },
  });
  return dbData;
}

interface Filters extends SearchParamsType {
  type?: objectTypeUnion;
  query?: string;
}

export const getObjectWithPayloadById = async (id:number) => {
  const dbData = await db.query.object.findFirst({
    where: eq(object.object_id, id),
    with: {
      statusInstead: true,
      city: true,
      parent: true,
      phones: true,
      links: true,
      objectOnSection: {with: {section: {with: {sectionOnSpec: {with: {spec: {with: {options: true}}}}}}}},
      objectOnOption: {with: {option: true}},
      schedule: true,
      photos: true,
      children: {with: {photos: true, phones: true, links: true, schedule: true}},
    }
  });
  if (dbData === undefined) throw new Error("getObjectById returned undefined");
  const processed = objectReadProcessing(dbData);
  return processed;
}

export const deleteObjectById = async (id:number) => {
  await db.delete(object).where(eq(object.object_id, id));
}

export const upsertObject = async (state:UIObject, init: UIObject): Promise<Object_> => {
  const fields = {
    object_id: state.object_id || undefined,
    name: state.name,
    name_locative: state.name_locative || null,
    name_where: state.name_where || null,
    type: state.type,
    status: state.status,
    status_inherit: state.status_inherit || null,
    status_comment: state.status_comment || null,
    status_confirm: state.status_confirm || null,
    status_instead_id: state.status_instead_id || null,
    city_id: state.city_id,
    parent_id: state.parent_id || null,
    address: state.address || null,
    address_2: state.address_2 || null,
    coord_inherit: state.coord_inherit || null,
    coord_lat: state.coord_lat || null,
    coord_lon: state.coord_lon || null,
    description: state.description || null,
    schedule_inherit: state.schedule_inherit || null,
    schedule_24_7: state.schedule_24_7 || null,
    schedule_date: state.schedule_date || null,
    schedule_source: state.schedule_source || null,
    schedule_comment: state.schedule_comment || null,
    created: state.created ? state.created : new Date(),
  };

  const [ upsertedObject ] = await db.insert(object).values(fields).onConflictDoUpdate({target: object.object_id, set: {...fields}}).returning();
  const children = await db.select({object_id: object.object_id}).from(object).where(eq(object.parent_id, upsertedObject.object_id));

  const phonesAdded = state.phones?.filter((statePhone) => !init?.phones?.some((initPhone) => statePhone.uiID === initPhone.uiID) && statePhone.value !== "");
  if (phonesAdded?.length) {
    await db.insert(object_phone).values(phonesAdded.map((phone) => ({...phone, object_id:upsertedObject.object_id})));
    children.length && children.forEach(async (child) => await db.insert(object_phone).values(phonesAdded.map((phone) => ({...phone, object_id:child.object_id}))));
  }
  const phonesChanged = state.phones?.filter((statePhone) => init.phones?.some((initPhone) => statePhone.uiID === initPhone.uiID && (statePhone.value !== initPhone.value || statePhone.comment !== initPhone.comment)));
  if (phonesChanged?.length) {
    phonesChanged.forEach(async (phone) => await db.update(object_phone).set({...phone, object_id: upsertedObject.object_id}).where(and(eq(object_phone.object_id, upsertedObject.object_id), eq(object_phone.order, phone.order))));
    children.length && children.forEach(async (child) => phonesChanged.forEach(async (phone) => await db.update(object_phone).set({...phone, object_id: child.object_id}).where(and(eq(object_phone.object_id, child.object_id), eq(object_phone.order, phone.order)))));
  }
  const phonesDeleted = init.phones?.filter((initPhone) => !state.phones?.some((statePhone) => initPhone.uiID === statePhone.uiID));
  if (phonesDeleted?.length) {
    await db.delete(object_phone).where(and(eq(object_phone.object_id, upsertedObject.object_id), inArray(object_phone.order, phonesDeleted.map((phone) => phone.order))));
    children.length && children.forEach(async (child) => phonesDeleted.forEach(async (phone) => await db.delete(object_phone).where(and(eq(object_phone.object_id, child.object_id), inArray(object_phone.order, phonesDeleted.map((phone) => phone.order))))));
  }

  const linksAdded = state.links?.filter((stateLink) => !init?.links?.some((initLink) => stateLink.uiID === initLink.uiID) && stateLink.value !== "");
  if (linksAdded?.length) {
    await db.insert(object_link).values(linksAdded?.map((link) => ({...link, object_id:upsertedObject.object_id})));
    children.length && children.forEach(async (child) => await db.insert(object_link).values(linksAdded?.map((link) => ({...link, object_id:child.object_id}))));
  }
  const linksChanged = state.links?.filter((stateLink) => init.links?.some((initLink) => stateLink.uiID === initLink.uiID && (stateLink.value !== initLink.value || stateLink.comment !== initLink.comment)));
  if (linksChanged?.length) {
    linksChanged.forEach(async (link) => await db.update(object_link).set({...link, object_id: upsertedObject.object_id}).where(and(eq(object_link.object_id, upsertedObject.object_id), eq(object_link.order, link.order))));
    children.length && children.forEach(async (child) => linksChanged.forEach(async (link) => await db.update(object_link).set({...link, object_id: child.object_id}).where(and(eq(object_link.object_id, child.object_id), eq(object_link.order, link.order)))));
  }
  const linksDeleted = init.links?.filter((initLink) => !state.links?.some((stateLink) => initLink.uiID === stateLink.uiID));
  if (linksDeleted?.length) {
    await db.delete(object_link).where(and(eq(object_link.object_id, upsertedObject.object_id), inArray(object_link.order, linksDeleted.map((link) => link.order))));
    children.length && children.forEach(async (child) => await db.delete(object_link).where(and(eq(object_link.object_id, child.object_id), inArray(object_link.order, linksDeleted.map((link) => link.order)))));
  }

  const sectionsAdded = state.sections?.filter((stateSection) => !init?.sections?.some((initSection) => stateSection.section_id === initSection.section_id));
  if (sectionsAdded?.length) {
    await db.insert(object_on_section).values(sectionsAdded.map((section) => ({...section, object_id: upsertedObject.object_id})));
    children.length && children.forEach(async (child) => await db.insert(object_on_section).values(sectionsAdded.map((section) => ({...section, object_id: child.object_id}))));
  }
  const sectionsDeleted = init.sections?.filter((initSection) => !state.sections?.some((stateSection) => initSection.section_id === stateSection.section_id));
  if (sectionsDeleted?.length) {
    await db.delete(object_on_section).where(and(eq(object_on_section.object_id, upsertedObject.object_id), inArray(object_on_section.section_id, sectionsDeleted.map((section) => section.section_id))));
    children.length && children.forEach(async (child) => await db.delete(object_on_section).where(and(eq(object_on_section.object_id, upsertedObject.object_id), inArray(object_on_section.section_id, sectionsDeleted.map((section) => section.section_id)))));
  }

  const optionsAdded = state.options?.filter((stateOption) => !init?.options?.some((initOption) => stateOption.option_id === initOption.option_id));
  if (optionsAdded?.length) {
    await db.insert(object_on_option).values(optionsAdded.map((option) => ({...option, object_id: upsertedObject.object_id})));
    children.length && children.forEach(async (child) => await db.insert(object_on_option).values(optionsAdded.map((option) => ({...option, object_id: child.object_id}))));
  }
  const optionsDeleted = init.options?.filter((initOption) => !state.options?.some((stateOption) => initOption.option_id === stateOption.option_id));
  if (optionsDeleted?.length) {
    await db.delete(object_on_option).where(and(eq(object_on_option.object_id, upsertedObject.object_id), inArray(object_on_option.option_id, optionsDeleted.map((opt) => opt.option_id))));
    children.length && children.forEach(async (child) => await db.delete(object_on_option).where(and(eq(object_on_option.object_id, child.object_id), inArray(object_on_option.option_id, optionsDeleted.map((opt) => opt.option_id)))));
  }

  const scheduleAdded = state.schedule?.filter((stateDay) => init.schedule?.some((initDay) => stateDay.day_num === initDay.day_num && !initDay.time && stateDay.time));
  if (scheduleAdded?.length) {
    await db.insert(object_schedule).values(scheduleAdded.map((schedule) => ({...schedule, object_id: upsertedObject.object_id})));
    children.length && children.forEach(async (child) => await db.insert(object_schedule).values(scheduleAdded.map((schedule) => ({...schedule, object_id: child.object_id}))));
  }
  const scheduleChanged = state.schedule?.filter((stateDay) => init.schedule?.some((initDay) => stateDay.day_num === initDay.day_num && stateDay.time && stateDay.time !== initDay.time));
  if (scheduleChanged?.length) {
    scheduleChanged.forEach(async (schedule) => await db.update(object_schedule).set({...schedule, object_id:undefined}).where(and(eq(object_schedule.object_id, upsertedObject.object_id), eq(object_schedule.day_num, schedule.day_num))));
    children.length && children.forEach(async (child) => scheduleChanged.forEach(async (schedule) => await db.update(object_schedule).set({...schedule, object_id:undefined}).where(and(eq(object_schedule.object_id, child.object_id), eq(object_schedule.day_num, schedule.day_num)))));
  }
  const scheduleDeleted = init.schedule?.filter((initDay) => state.schedule?.some((stateDay) => initDay.day_num === stateDay.day_num && initDay.time && !stateDay.time));
  if (scheduleDeleted?.length) {
    await db.delete(object_schedule).where(and(eq(object_schedule.object_id, upsertedObject.object_id), inArray(object_schedule.day_num, scheduleDeleted.map((schedule) => schedule.day_num))));
    children.length && children.forEach(async (child) => await db.delete(object_schedule).where(and(eq(object_schedule.object_id, child.object_id), inArray(object_schedule.day_num, scheduleDeleted.map((schedule) => schedule.day_num)))));
  }

  const photosAdded = state.photos?.filter((statePhoto) => !init?.photos?.some((initPhoto) => statePhoto.uiID === initPhoto.uiID));
  if (photosAdded?.length) {
    await db.insert(object_photo).values(photosAdded.map((photo) => ({...photo, name: photo.name.replace("ID", String(upsertedObject.object_id)), object_id: upsertedObject.object_id})));
    children.length && children.forEach(async (child) => await db.insert(object_photo).values(photosAdded.map((photo) => ({...photo, name: photo.name.replace("ID", String(child.object_id)), object_id: child.object_id}))));
  }
  const photosDeleted = init.photos?.filter((initPhoto) => !state.photos?.some((statePhoto) => initPhoto.uiID === statePhoto.uiID));
  if (photosDeleted?.length) {
    await db.delete(object_photo).where(and(eq(object_photo.object_id, upsertedObject.object_id), inArray(object_photo.order, photosDeleted.map((photo) => photo.order))));
    children.length && children.forEach(async (child) => await db.delete(object_photo).where(and(eq(object_photo.object_id, upsertedObject.object_id), inArray(object_photo.order, photosDeleted.map((photo) => photo.order)))));
  }
  // const photosMoved = state.photos?.filter((statePhoto) => init.photos?.some((initPhoto) => statePhoto.localId === initPhoto.localId && statePhoto.order !== initPhoto.order));
  return upsertedObject;
}