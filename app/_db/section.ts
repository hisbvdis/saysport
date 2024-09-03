"use server";
import { nanoid } from "nanoid";
import { db } from "@/drizzle/client";
import { revalidatePath } from "next/cache";
import { and, eq, ilike, inArray } from "drizzle-orm";
import { objectTypeEnum, type objectTypeUnion, Section, section, section_on_spec, section_on_usage, sectionTypeEnum, type sectionTypeUnion, spec } from "@/drizzle/schema";
// -----------------------------------------------------------------------------
import type { DBSection, EditSection, ProcSection } from "@/app/_types/types";
import { sectionReadProcessing } from "./section.processing";


export const getEmptySection = async ():Promise<EditSection> => {
  return {
    section_id: null,
    section_type: sectionTypeEnum.section,
    object_type: objectTypeEnum.org,
    name_service: "",
    name_public_plural: "",
    name_public_singular: "",
    name_seo_title: "",
    specs: [],
    uiID: nanoid(),
    usages: [],
  }
}

export const getAllSections = async ():Promise<ProcSection[]> => {
  const dbData:DBSection[] = await db.query.section.findMany({
    with: {
      sectionOnSpecs: {with: {spec: {with: {options: true}}}}
    },
    orderBy: [section.name_public_plural],
  });
  const processed = dbData.map((section) => sectionReadProcessing(section));
  return processed;
}

export const getSectionsByFilters = async (filters:{objectType?:objectTypeUnion;sectionType?:sectionTypeUnion;name_service?:string;name_public_plural?:string}):Promise<ProcSection[]> => {
  const objectType = filters.objectType;
  const sectionType = filters.sectionType;
  const name_public_plural = filters.name_public_plural;
  const dbData:DBSection[] = await db.query.section.findMany({
    where: and(
      name_public_plural ? ilike(section.name_public_plural, `%${name_public_plural}%`) : undefined,
      objectType ? eq(section.object_type, objectType) : undefined,
      sectionType ? eq(section.section_type, sectionType) : undefined,
    ),
    with: {
      sectionOnSpecs: {with: {spec: {with: {options: true}}}}
    },
  })
  const processed = dbData.map((section) => sectionReadProcessing(section));
  return processed;
}

export const getSectionById = async (id:number):Promise<ProcSection> => {
  const dbData:DBSection|undefined = await db.query.section.findFirst({
    where: eq(section.section_id, id),
    with: {
      sectionOnSpecs: {with: {spec: {with: {options: true}}}},
      sectionOnUsages: {with: {usage: true}},
    },
  });
  if (dbData === undefined) throw new Error("getSectionById returned undefined");
  const processed = sectionReadProcessing(dbData);
  return processed;
}

export const deleteSectionById = async (id:number):Promise<void> => {
  await db.delete(section).where(eq(section.section_id, id));
  revalidatePath("/admin/sections");
}

export const upsertSection = async (state:EditSection, init: EditSection) => {
  const fields = {
    section_id: state.section_id ?? undefined,
    section_type: state.section_type,
    name_service: state.name_service,
    name_public_plural: state.name_public_plural,
    name_public_singular: state.name_public_singular,
    name_seo_title: state.name_seo_title,
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

  const usagesAdded = state.usages?.filter((stateUsage) => !init.usages?.some((initUsage) => stateUsage.usage_id === initUsage.usage_id));
  if (usagesAdded.length) {
    await db.insert(section_on_usage).values(usagesAdded.map((section_on_usage) => ({section_id: upsertedSection.section_id, usage_id: section_on_usage.usage_id})));
  }
  const usagesDeleted = init.usages?.filter((initUsage) => !state.usages?.some((stateUsage) => initUsage.usage_id === stateUsage.usage_id));
  if (usagesDeleted.length) {
    await db.delete(section_on_usage).where(and(eq(section_on_usage.section_id, upsertedSection.section_id), inArray(section_on_usage.usage_id, usagesDeleted.map((usage) => usage.usage_id))));
  }

  revalidatePath("/admin/sections");
  return upsertedSection;
}