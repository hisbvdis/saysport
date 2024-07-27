"use server";
import { db } from "@/drizzle/client";
import { revalidatePath } from "next/cache";
import { and, eq, inArray } from "drizzle-orm";
import { objectTypeEnum, type objectTypeUnion, option, type Section, section, section_on_spec, spec } from "@/drizzle/schema";
// -----------------------------------------------------------------------------
import type { UISection } from "@/app/_types/types";
import { sectionReadProcessing } from "./section.processing";


export const getEmptySection = async ():Promise<UISection> => {
  return {
    section_id: 0,
    object_type: objectTypeEnum.org,
    name_plural: "",
    name_singular: "",
    specs: [],
    uiID: crypto.randomUUID(),
  }
}

export const getAllSections = async ():Promise<Section[]> => {
  const dbData = await db.select().from(section);
  return dbData;
}

export const getSectionsByFilters = async (filters:{objectType?:objectTypeUnion}):Promise<Section[]> => {
  const objectType = filters.objectType;
  const dbData = await db.select().from(section).where(
    objectType ? eq(section.object_type, objectType) : undefined
  );
  return dbData;
}

export const getSectionById = async (id:number):Promise<Section> => {
  const dbData = (await db.select().from(section).where(eq(section.section_id, id)))[0];
  return dbData;
}

export const getAllSectionsWithPayload = async ():Promise<UISection[]> => {
  const dbData = await db.query.section.findMany({
    with: {sectionOnSpec: {with: {spec: {with: {options: true}}}}},
  })
  const processed = dbData.map((section) => sectionReadProcessing(section));
  return processed;
}

export const getSectionsWithPayloadByFilters = async (filters:{objectType?:objectTypeUnion}):Promise<UISection[]> => {
  const objectType = filters.objectType;
  const dbData = await db.query.section.findMany({
    where: objectType ? eq(section.object_type, objectType) : undefined,
    with: {sectionOnSpec: {with: {spec: {with: {options: true}}}}},
  })
  const processed = dbData.map((section) => sectionReadProcessing(section));
  return processed;
}

export const getSectionWithPayloadById = async (id:number):Promise<UISection> => {
  const dbData = await db.query.section.findFirst({
    where: eq(section.section_id, id),
    with: {sectionOnSpec: {with: {spec: {with: {options: true}}}}},
  })
  if (dbData === undefined) throw new Error("getSectionWithPayloadById returned undefined");
  const processed = sectionReadProcessing(dbData);
  return processed;
}

export const deleteSectionById = async (id:number):Promise<void> => {
  await db.delete(section).where(eq(section.section_id, id));
  revalidatePath("/admin/sections");
}

export const upsertSection = async (state:UISection, init: UISection) => {
  const fields = {
    section_id: state.section_id || undefined,
    name_plural: state.name_plural,
    name_singular: state.name_singular,
    object_type: state.object_type,
  }
  const [upsertedSection] = await db.insert(section).values(fields).onConflictDoUpdate({target: section.section_id, set: fields}).returning();

  const specsAdded = state.specs?.filter((stateSpec) => !init.specs?.some((initSpec) => stateSpec.spec_id === initSpec.spec_id));
  if (specsAdded.length) {
    await db.insert(section_on_spec).values(specsAdded.map((section_on_spec) => ({section_id: upsertedSection.section_id, spec_id: section_on_spec.spec_id})));
    specsAdded?.forEach(async (item) => await db.update(spec).set(item).where(eq(spec.spec_id, item.spec_id)));
  }

  const specsDeleted = init.specs?.filter((initSpec) => !state.specs?.some((stateSpec) => initSpec.spec_id === stateSpec.spec_id));
  specsDeleted.length ? await db.delete(section_on_spec).where(and(eq(section_on_spec.section_id, upsertedSection.section_id), inArray(section_on_spec.spec_id, specsDeleted.map((spec) => spec.spec_id)))) : undefined;

  const specsChanged = state.specs?.filter((stateSpec) => init.specs?.some((initSpec) => stateSpec.uiID === initSpec.uiID && (stateSpec.order !== initSpec.order)));
  specsChanged?.forEach(async (item) => await db.update(spec).set(item).where(eq(spec.spec_id, item.spec_id)));

  revalidatePath("/admin/sections");
  return upsertedSection;
}