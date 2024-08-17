"use server";
import { db } from "@/drizzle/client";
import { revalidatePath } from "next/cache";
import { and, eq, ilike } from "drizzle-orm";
import { objectTypeEnum, usage_name, type UsageName, type objectTypeUnion } from "@/drizzle/schema";
// -----------------------------------------------------------------------------


export const getEmptyUsage = async ():Promise<UsageName> => {
  return {
    usage_name_id: -1,
    name_service: "",
    name_public: "",
    object_type: objectTypeEnum.org
  }
}

export const getAllUsages = async ():Promise<UsageName[]> => {
  const dbData = await db.query.usage_name.findMany()
  return dbData;
}

export const getUsagesByFilters = async (filters:{objectType?:objectTypeUnion;name_service?:string;name_public?:string}):Promise<UsageName[]> => {
  const objectType = filters.objectType;
  const name_service = filters.name_service;
  const name_public = filters.name_public;
  const dbData = await db.query.usage_name.findMany({
    where: and(
      name_service ? ilike(usage_name.name_service, `%${name_service}%`) : undefined,
      name_public ? ilike(usage_name.name_public, `%${name_public}%`) : undefined,
      objectType ? eq(usage_name.object_type, objectType) : undefined,
    )
  })
  return dbData;
}

export const getUsageById = async (id:number):Promise<UsageName> => {
  const dbData = await db.query.usage_name.findFirst({
    where: eq(usage_name.usage_name_id, id)
  }) satisfies UsageName|undefined;
  if (dbData === undefined) throw new Error("getUsageById returned undefined");
  return dbData;
}

export const deleteUsageById = async (id:number):Promise<void> => {
  await db.delete(usage_name).where(eq(usage_name.usage_name_id, id));
  revalidatePath("/admin/usages");
}

export const upsertUsage = async (state:UsageName, init: UsageName) => {
  const fields = {
    usage_name_id: state.usage_name_id > 0 ? state.usage_name_id : undefined,
    name_service: state.name_service,
    name_public: state.name_public,
    object_type: state.object_type,
  }
  const [upsertedUsage] = await db.insert(usage_name).values(fields).onConflictDoUpdate({target: usage_name.usage_name_id, set: fields}).returning();

  revalidatePath("/admin/usages");
  return upsertedUsage;
}