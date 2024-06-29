"use server";
import { eq } from "drizzle-orm";
import { db } from "@/drizzle/client";
import { revalidatePath } from "next/cache";
import { SpecSelect, objectTypeEnum, option, optionsNumberEnum, spec } from "@/drizzle/schema";
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

export const getSpecsByFilters = async (filters?:{objectType?:objectTypeEnum}) => {
  const objectType = filters?.objectType;
  const dbData = await db.query.spec.findMany({
    where: objectType ? eq(spec.object_type, objectType) : undefined
  })
  return dbData;
}

export const getSpecById = async (id: number):Promise<UISpec> => {
  const dbData = await db.query.spec.findFirst({
    where: eq(spec.spec_id, id),
    with: {
      options: true,
    }
  });
  if (dbData === undefined) throw new Error("getSpecById returned null");
  const processed = specReadProcessing(dbData);
  return processed;
};

export const deleteSpecById = async (id:number): Promise<void> => {
  await db.delete(spec).where(
    eq(spec.spec_id, id)
  );
  revalidatePath("/admin/specs", "page");
}

export const upsertSpec = async (state:UISpec, init:UISpec):Promise<SpecSelect> => {
  const fields = {
    spec_id: state.spec_id || undefined,
    name_service: state.name_service,
    name_public: state.name_public,
    object_type: state.object_type,
    options_number: state.options_number,
  }

  const [upsertedSpec] = await db.insert(spec).values({...fields}).onConflictDoUpdate({target: spec.spec_id, set: {...fields}}).returning();

  const optionsAdded = state.options?.filter((stateOption) => !init.options?.some((initOption) => initOption.option_id === stateOption.option_id));
  optionsAdded?.forEach(async (item) => await db.insert(option).values({...item, option_id: undefined, spec_id: upsertedSpec.spec_id}))

  const optionsChanged = state.options?.filter((stateOption) => init.options?.some((initOption) => stateOption.uiID === initOption.uiID && (stateOption.name !== initOption.name || stateOption.order !== initOption.order)));
  optionsChanged?.forEach(async (item) => await db.update(option).set(item).where(eq(option.option_id, item.option_id)));

  const optionsDeleted = init.options?.filter((initOption) => !state.options?.some((stateOption) => stateOption.option_id === initOption.option_id));
  optionsDeleted?.forEach(async (item) => await db.delete(option).where(eq(option.option_id, item.option_id)));

  revalidatePath("/admin/specs", "page");
  return upsertedSpec;
}