"use server";
import { db } from "@/drizzle/client";
import { revalidatePath } from "next/cache";
import { and, eq, ilike, inArray } from "drizzle-orm";
import { objectTypeEnum, type objectTypeUnion, section, section_on_spec, section_on_usage, sectionTypeEnum, type sectionTypeUnion, spec } from "@/drizzle/schema";
// -----------------------------------------------------------------------------
import type { DBSection, UISection } from "@/app/_types/types";
import { sectionReadProcessing } from "./section.processing";


export const getEmptySection = async ():Promise<UISection> => {
  return {
    section_id: -1,
    section_type: sectionTypeEnum.section,
    object_type: objectTypeEnum.org,
    name_service: "",
    name_public_plural: "",
    name_public_singular: "",
    specs: [],
    usages: [],
    uiID: crypto.randomUUID(),
  }
}

export const getAllSections = async ():Promise<UISection[]> => {
  const dbData = await db.query.section.findMany({
    with: {sectionOnSpec: {with: {spec: {with: {options: true}}}}},
    orderBy: [section.name_public_plural]
  })
  const processed = dbData.map((section) => sectionReadProcessing(section));
  return processed;
}

export const getSectionsByFilters = async (filters:{objectType?:objectTypeUnion,sectionType?:sectionTypeUnion,name_service?:string}):Promise<UISection[]> => {
  const objectType = filters.objectType;
  const sectionType = filters.sectionType;
  const name_service = filters.name_service;
  const dbData = await db.query.section.findMany({
    where: and(
      name_service ? ilike(section.name_service, name_service) : undefined,
      objectType ? eq(section.object_type, objectType) : undefined,
      sectionType ? eq(section.section_type, sectionType) : undefined,
    ),
    with: {sectionOnSpec: {with: {spec: {with: {options: true}}}}},
  })
  const processed = dbData.map((section) => sectionReadProcessing(section));
  return processed;
}

export const getSectionById = async (id:number):Promise<UISection> => {
  const dbData = await db.query.section.findFirst({
    where: eq(section.section_id, id),
    with: {
      sectionOnSpec: {with: {spec: {with: {options: true}}}},
      sectionOnUsage: {with: {usage: {with: {sectionOnSpec: {with: {spec: {with: {options: true}}}}}}}}
    },
  }) satisfies DBSection|undefined;
  if (dbData === undefined) throw new Error("getSectionById returned undefined");
  const processed = sectionReadProcessing(dbData);
  return processed;
}

export const deleteSectionById = async (id:number):Promise<void> => {
  await db.delete(section).where(eq(section.section_id, id));
  revalidatePath("/admin/sections");
}

export const upsertSection = async (state:UISection, init: UISection) => {
  const fields = {
    section_id: state.section_id > 0 ? state.section_id : undefined,
    section_type: state.section_type,
    name_service: state.name_service,
    name_public_plural: state.name_public_plural,
    name_public_singular: state.name_public_singular,
    object_type: state.object_type,
  }
  const [upsertedSection] = await db.insert(section).values(fields).onConflictDoUpdate({target: section.section_id, set: fields}).returning();

  const specsAdded = state.specs?.filter((stateSpec) => !init.specs?.some((initSpec) => stateSpec.spec_id === initSpec.spec_id));
  if (specsAdded.length) {
    await db.insert(section_on_spec).values(specsAdded.map((section_on_spec) => ({section_id: upsertedSection.section_id, spec_id: section_on_spec.spec_id})));
    specsAdded?.forEach(async (item) => await db.update(spec).set(item).where(eq(spec.spec_id, item.spec_id)));
  }
  const specsDeleted = init.specs?.filter((initSpec) => !state.specs?.some((stateSpec) => initSpec.spec_id === stateSpec.spec_id));
  if (specsDeleted.length) {
    await db.delete(section_on_spec).where(and(eq(section_on_spec.section_id, upsertedSection.section_id), inArray(section_on_spec.spec_id, specsDeleted.map((spec) => spec.spec_id))));
  }
  const specsChanged = state.specs?.filter((stateSpec) => init.specs?.some((initSpec) => stateSpec.uiID === initSpec.uiID && (stateSpec.order !== initSpec.order)));
  if (specsChanged.length) {
    specsChanged?.forEach(async (item) => await db.update(spec).set(item).where(eq(spec.spec_id, item.spec_id)));
  }

  const usagesAdded = state.usages?.filter((stateUsage) => !init.usages?.some((initUsages) => stateUsage.section_id === initUsages.section_id));
  if (usagesAdded.length) {
    await db.insert(section_on_usage).values(usagesAdded.map((usage) => ({section_id: upsertedSection.section_id, usage_id: usage.section_id})));
  }
  const usagesDeleted = init.usages?.filter((initUsage) => !state.usages?.some((stateUsage) => initUsage.section_id === stateUsage.section_id));
  if (usagesDeleted.length) {
    await db.delete(section_on_usage).where(and(eq(section_on_usage.section_id, upsertedSection.section_id), inArray(section_on_usage.usage_id, usagesDeleted.map((usage) => usage.section_id))));
  }

  revalidatePath("/admin/sections");
  return upsertedSection;
}