"use server";
import { db } from "@/drizzle/client"
import { category, category_on_section, type Category } from "@/drizzle/schema"
import { categoryReadProcessing } from "./category.processing"
import type { DBCategory, EditCategory, ProcessedCategory } from "@/app/_types/types"
import { and, eq, inArray } from "drizzle-orm"
import { revalidatePath } from "next/cache"


export const getEmptyCategory = async ():Promise<EditCategory> => {
  return {
    category_id: null,
    name: "",
    order: 0,
    sections: [],
  }
}

export const getAllCategories = async ():Promise<ProcessedCategory[]> => {
  const dbData:DBCategory[] = await db.query.category.findMany({
    with: {
      categoryOnSections: {with: {section: true}},
    },
    orderBy: [category.order]
  });
  const processed = dbData.map((category) => categoryReadProcessing(category));
  return processed;
}

export const getCategoryById = async (id:number):Promise<ProcessedCategory> => {
  const dbData:DBCategory|undefined = await db.query.category.findFirst({
    where: eq(category.category_id, id),
    with: {
      categoryOnSections: {with: {section: true}}
    },
  });
  if (dbData === undefined) throw new Error("getSectionById returned undefined");
  const processed = categoryReadProcessing(dbData);
  return processed;
}

export const deleteCategoryById = async (id:number):Promise<void> => {
  await db.delete(category).where(eq(category.category_id, id));
  revalidatePath("/admin/categories");
}

export const upsertCategory = async (state:EditCategory, init: EditCategory) => {
  const fields = {
    category_id: state.category_id ?? undefined,
    name: state.name,
    order: state.order
  }
  const [upsertedCategory] = await db.insert(category).values(fields).onConflictDoUpdate({target: category.category_id, set: fields}).returning();

  const sectionsAdded = state.sections?.filter((stateSection) => !init.sections?.some((initSections) => stateSection.section_id === initSections.section_id));
  if (sectionsAdded.length) {
    await db.insert(category_on_section).values(sectionsAdded.map((section) => ({category_id: upsertedCategory.category_id, section_id: section.section_id})));
  }
  const sectionsDeleted = init.sections?.filter((initSection) => !state.sections?.some((stateSection) => initSection.section_id === stateSection.section_id));
  if (sectionsDeleted.length) {
    await db.delete(category_on_section).where(and(eq(category_on_section.category_id, upsertedCategory.category_id), inArray(category_on_section.section_id, sectionsDeleted.map((section) => section.section_id))));
  }

  revalidatePath("/admin/sections");
  return upsertedCategory;
}