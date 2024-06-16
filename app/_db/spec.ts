"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/prisma/dbClient";
import { $Enums, spec } from "@prisma/client";
// -----------------------------------------------------------------------------
import { UISpec } from "@/app/_types/types";
import { specReadProcessing } from "./spec.processing";


export const getEmptySpec = async ():Promise<UISpec> => {
  return {
    id: -1,
    name_service: "",
    name_public: "",
    object_type: $Enums.objectTypeEnum.org as $Enums.objectTypeEnum,
    options_number: $Enums.optionsNumberEnum.many as $Enums.optionsNumberEnum,
    uiID: crypto.randomUUID(),
  }
}

export const getSpecsByFilters = async (filters?:{objectType?:$Enums.objectTypeEnum}) => {
  const objectType = filters?.objectType;
  const dbData = await prisma.spec.findMany({
    where: {
      object_type: objectType,
    },
  });
  return dbData;
}

export const getSpecById = async (id: number):Promise<UISpec> => {
  const dbData = await prisma.spec.findUnique({
    where: {
      id: id,
    },
    include: {
      options: { orderBy: { order: "asc" } },
    },
  });
  if (dbData === null) throw new Error("getSpecById returned null");
  const processed = specReadProcessing(dbData);
  return processed;
};

export const deleteSpecById = async (id:number): Promise<void> => {
  await prisma.spec.delete({
    where: {
      id: id
    }
  });
  revalidatePath("/admin/specs", "page");
}

export const upsertSpec = async (state:UISpec, init:UISpec):Promise<spec> => {
  const fields = {
    name_service: state.name_service,
    name_public: state.name_public,
    object_type: state.object_type,
    options_number: state.options_number,
  }
  const optionsAdded = state.options?.filter((stateOption) => !init.options?.some((initOption) => initOption.id === stateOption.id));
  const optionsChanged = state.options?.filter((stateOption) => init.options?.some((initOption) => stateOption.uiID === initOption.uiID && (stateOption.name !== initOption.name || stateOption.order !== initOption.order)));
  const optionsDeleted = init.options?.filter((initOption) => !state.options?.some((stateOption) => stateOption.id === initOption.id));
  const response = await prisma.spec.upsert({
    where: {
      id: state?.id ?? -1
    },
    create: {
      ...fields,
      options: {
        create: optionsAdded?.length ? optionsAdded.map((opt) => ({...opt, id:undefined, spec_id: undefined, uiID: undefined})) : undefined,
      }
    },
    update: {
      ...fields,
      options: {
        create: optionsAdded?.length ? optionsAdded.map((opt) => ({...opt, id:undefined, spec_id: undefined, uiID: undefined})) : undefined,
        update: optionsChanged?.length ? optionsChanged.map((opt) => ({where: {id: opt.id}, data: {...opt, id:undefined, uiID: undefined, spec_id: undefined}})) : undefined,
        deleteMany: optionsDeleted?.length ? optionsDeleted.map(({id}) => ({id: id})) : undefined
      }
    }
  });
  revalidatePath("/admin/specs", "page");
  return response;
}