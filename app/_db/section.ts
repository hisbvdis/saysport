"use server";
import { db } from "@/drizzle/client";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { objectTypeEnum, section, section_on_spec } from "@/drizzle/schema";
// -----------------------------------------------------------------------------
import { UISection } from "@/app/_types/types";
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

export const getSectionsByFilters = async (filters?:{objectType?:objectTypeEnum}):Promise<UISection[]> => {
  const objectType = filters?.objectType;
  const dbData = await db.query.section.findMany({
    where: objectType ? eq(section.object_type, objectType) : undefined,
    with: {sectionOnSpec: {with: {spec: {with: {options: true}}}}},
  })
  const processed = dbData.map((section) => sectionReadProcessing(section));
  return processed;
}

export const getSectionById = async (id:number):Promise<UISection> => {
  const dbData = await db.query.section.findFirst({
    where: eq(section.section_id, id),
    with: {sectionOnSpec: {with: {spec: {with: {options: true}}}}},
  })
  if (dbData === undefined) throw new Error("getSectionById returned null");
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
  const [upsertedSection] = await db.insert(section).values({...fields}).onConflictDoUpdate({target: section.section_id, set: {...fields}}).returning();

  const specsAdded = state.specs?.filter((stateSpec) => !init.specs?.some((initSpec) => stateSpec.spec_id === initSpec.spec_id));
  specsAdded.forEach(async (specItem) => await db.insert(section_on_spec).values({section_id: upsertedSection.section_id, spec_id: specItem.spec_id}))

  const specsDeleted = init.specs?.filter((initSpec) => !state.specs?.some((stateSpec) => initSpec.spec_id === stateSpec.spec_id));
  specsDeleted.forEach(async (specItem) => await db.delete(section_on_spec).where(and(eq(section_on_spec.section_id, upsertedSection.section_id), eq(section_on_spec.spec_id, specItem.spec_id))));

  revalidatePath("/admin/sections");
  return upsertedSection;
}