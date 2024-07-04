"use server";
import { db } from "@/drizzle/client";
import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { Spec, objectTypeEnum, objectTypeUnion, option, optionsNumberEnum, spec } from "@/drizzle/schema";
// -----------------------------------------------------------------------------
import { UISpec } from "@/app/_types/types";
import { specReadProcessing } from "./spec.processing";


export const getEmptySpec = async ():Promise<UISpec> => {
  return {
    spec_id: 0,
    name_service: "",
    name_public: "",
    object_type: objectTypeEnum.org,
    options_number: optionsNumberEnum.many,
    uiID: crypto.randomUUID(),
  }
}

export const getAllSpecs = async ():Promise<Spec[]> => {
  const dbData = await db.select().from(spec);
  return dbData;
}

export const getSpecsByFilters = async (filters:Filters):Promise<Spec[]> => {
  const objectType = filters.objectType;
  const dbData = await db.select().from(spec).where(
    objectType ? eq(spec.object_type, objectType) : undefined
  );
  return dbData;
}

interface Filters {
  objectType?:objectTypeUnion
}

export const getSpecById = async (id: number):Promise<UISpec> => {
  const dbSpec = (await db.select().from(spec).where(eq(spec.spec_id, id)))[0];
  const dbSpecOptions = await db.select().from(option).where(eq(option.spec_id, id));
  const dbData = {...dbSpec, options: dbSpecOptions};
  const processed = specReadProcessing(dbData);
  return processed;
};

export const deleteSpecById = async (id:number): Promise<void> => {
  await db.delete(spec).where(eq(spec.spec_id, id));
  revalidatePath("/admin/specs", "page");
}

export const upsertSpec = async (state:UISpec, init:UISpec):Promise<Spec> => {
  const fields = {
    spec_id: state.spec_id || undefined,
    name_service: state.name_service,
    name_public: state.name_public,
    object_type: state.object_type,
    options_number: state.options_number,
  }

  const [upsertedSpec] = await db.insert(spec).values({...fields}).onConflictDoUpdate({target: spec.spec_id, set: {...fields}}).returning();

  const optionsAdded = state.options?.filter((stateOption) => !init.options?.some((initOption) => initOption.option_id === stateOption.option_id));
  optionsAdded?.length ? await db.insert(option).values(optionsAdded.map((option) => ({...option, spec_id: upsertedSpec.spec_id, option_id: undefined}))) : undefined;

  const optionsChanged = state.options?.filter((stateOption) => init.options?.some((initOption) => stateOption.uiID === initOption.uiID && (stateOption.name !== initOption.name || stateOption.order !== initOption.order)));
  optionsChanged?.forEach(async (item) => await db.update(option).set(item).where(eq(option.option_id, item.option_id)));

  const optionsDeleted = init.options?.filter((initOption) => !state.options?.some((stateOption) => stateOption.option_id === initOption.option_id));
  optionsDeleted?.length ? await db.delete(option).where(inArray(option.option_id, optionsDeleted.map((opt) => opt.option_id))) : undefined;

  revalidatePath("/admin/specs", "page");
  return upsertedSpec;
}