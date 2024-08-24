"use server";
import { db } from "@/drizzle/client";
import { revalidatePath } from "next/cache";
import { and, eq, exists, ilike, inArray } from "drizzle-orm";
import { objectTypeEnum, section_on_usage, usage, type Usage, type objectTypeUnion } from "@/drizzle/schema";
import type { EditUsage } from "../_types/types";
// -----------------------------------------------------------------------------


export const getEmptyUsage = async ():Promise<EditUsage> => {
  return {
    usage_id: null,
    name_service: "",
    name_public: "",
    object_type: objectTypeEnum.org
  }
}

export const getAllUsages = async ():Promise<Usage[]> => {
  const dbData = await db.query.usage.findMany()
  return dbData;
}

export const getUsagesByFilters = async (filters:{objectType?:objectTypeUnion;name_service?:string;name_public?:string,sectionIds?:number[]}):Promise<Usage[]> => {
  const objectType = filters.objectType;
  const name_service = filters.name_service;
  const name_public = filters.name_public;
  const sectionIds = filters.sectionIds;
  const dbData = await db.query.usage.findMany({
    where: and(
      name_service ? ilike(usage.name_service, `%${name_service}%`) : undefined,
      name_public ? ilike(usage.name_public, `%${name_public}%`) : undefined,
      objectType ? eq(usage.object_type, objectType) : undefined,
      sectionIds?.length ? exists(db.select().from(section_on_usage).where(and(eq(section_on_usage.usage_id, usage.usage_id), inArray(section_on_usage.section_id, sectionIds)))) : undefined,
    )
  })
  return dbData;
}

export const getUsageById = async (id:number):Promise<Usage> => {
  const dbData:Usage|undefined = await db.query.usage.findFirst({
    where: eq(usage.usage_id, id)
  });
  if (dbData === undefined) throw new Error("getUsageById returned undefined");
  return dbData;
}

export const deleteUsageById = async (id:number):Promise<void> => {
  await db.delete(usage).where(eq(usage.usage_id, id));
  revalidatePath("/admin/usages");
}

export const upsertUsage = async (state:EditUsage, init: EditUsage) => {
  const fields = {
    usage_id: state.usage_id ?? undefined,
    name_service: state.name_service,
    name_public: state.name_public,
    object_type: state.object_type,
  }
  const [upsertedUsage] = await db.insert(usage).values(fields).onConflictDoUpdate({target: usage.usage_id, set: fields}).returning();

  revalidatePath("/admin/usages");
  return upsertedUsage;
}