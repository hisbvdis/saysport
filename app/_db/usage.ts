"use server";
import { db } from "@/drizzle/client";
import { revalidatePath } from "next/cache";
import { and, eq, ilike } from "drizzle-orm";
import type { UIUsage } from "../_types/types";
import { objectTypeEnum, type objectTypeUnion, usage, type Usage } from "@/drizzle/schema";
// -----------------------------------------------------------------------------


export const getEmptyUsage = async ():Promise<Usage> => {
  return {
    usage_id: -1,
    object_type: objectTypeEnum.org,
    name_service: "",
    name_public: "",
  }
}

export const getAllUsages = async ():Promise<Usage[]> => {
  const dbData = await db.query.usage.findMany()
  return dbData;
}

export const getUsagesByFilters = async (filters:{objectType?:objectTypeUnion;name_service?:string;name_public?:string}):Promise<Usage[]> => {
  const objectType = filters.objectType;
  const name_service = filters.name_service;
  const name_public = filters.name_public;
  const dbData = await db.query.usage.findMany({
    where: and(
      name_service ? ilike(usage.name_service, `%${name_service}%`) : undefined,
      name_public ? ilike(usage.name_public, `%${name_public}%`) : undefined,
      objectType ? eq(usage.object_type, objectType) : undefined,
    )
  })
  return dbData;
}

export const getUsageById = async (id:number):Promise<Usage> => {
  const dbData = await db.query.usage.findFirst({
    where: eq(usage.usage_id, id)
  }) satisfies Usage|undefined;
  if (dbData === undefined) throw new Error("getUsageById returned undefined");
  // const processed = sectionReadProcessing(dbData);
  // return processed;
  return dbData;
}

export const deleteUsageById = async (id:number):Promise<void> => {
  await db.delete(usage).where(eq(usage.usage_id, id));
  revalidatePath("/admin/usages");
}

export const upsertUsage = async (state:Usage, init: Usage) => {
  const fields = {
    usage_id: state.usage_id > 0 ? state.usage_id : undefined,
    name_service: state.name_service,
    name_public: state.name_public,
    object_type: state.object_type,
  }
  const [upsertedUsage] = await db.insert(usage).values(fields).onConflictDoUpdate({target: usage.usage_id, set: fields}).returning();

  revalidatePath("/admin/usages");
  return upsertedUsage;
}