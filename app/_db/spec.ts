"use server";
import { revalidatePath } from "next/cache";
// -----------------------------------------------------------------------------
import { UISpec } from "@/app/_types/types";
import { specReadProcessing } from "./spec.processing";
import { db } from "@/drizzle/client";
import { eq } from "drizzle-orm";
import { objectTypeEnum, optionsNumberEnum, spec } from "@/drizzle/schema";


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

// export const getSpecsByFilters = async (filters?:{objectType?:$Enums.objectTypeEnum}) => {
//   const objectType = filters?.objectType;
//   const dbData = await prisma.spec.findMany({
//     where: {
//       object_type: objectType,
//     },
//   });
//   return dbData;
// }

export const getSpecsByFilters = async (filters?:{objectType?:objectTypeEnum}) => {
  const objectType = filters?.objectType;
  const dbData = await db.query.spec.findMany({
    where: objectType ? eq(spec.object_type, objectType) : undefined
  })
  return dbData;
}

// export const getSpecById = async (id: number):Promise<UISpec> => {
//   const dbData = await prisma.spec.findUnique({
//     where: {
//       spec_id: id,
//     },
//     include: {
//       options: { orderBy: { order: "asc" } },
//     },
//   });
//   if (dbData === null) throw new Error("getSpecById returned null");
//   const processed = specReadProcessing(dbData);
//   return processed;
// };

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

// export const deleteSpecById = async (id:number): Promise<void> => {
//   await prisma.spec.delete({
//     where: {
//       spec_id: id
//     }
//   });
//   revalidatePath("/admin/specs", "page");
// }

export const deleteSpecById = async (id:number): Promise<void> => {
  await db.delete(spec).where(
    eq(spec.spec_id, id)
  );
  revalidatePath("/admin/specs", "page");
}

// export const upsertSpec = async (state:UISpec, init:UISpec):Promise<spec_> => {
//   const fields = {
//     name_service: state.name_service,
//     name_public: state.name_public,
//     object_type: state.object_type,
//     options_number: state.options_number,
//   }
//   const optionsAdded = state.options?.filter((stateOption) => !init.options?.some((initOption) => initOption.option_id === stateOption.option_id));
//   const optionsChanged = state.options?.filter((stateOption) => init.options?.some((initOption) => stateOption.uiID === initOption.uiID && (stateOption.name !== initOption.name || stateOption.order !== initOption.order)));
//   const optionsDeleted = init.options?.filter((initOption) => !state.options?.some((stateOption) => stateOption.option_id === initOption.option_id));
//   const response = await prisma.spec.upsert({
//     where: {
//       spec_id: state?.spec_id ?? -1
//     },
//     create: {
//       ...fields,
//       options: {
//         create: optionsAdded?.length ? optionsAdded.map((opt) => ({...opt, id:undefined, spec_id: undefined, uiID: undefined})) : undefined,
//       }
//     },
//     update: {
//       ...fields,
//       options: {
//         create: optionsAdded?.length ? optionsAdded.map((opt) => ({...opt, id:undefined, spec_id: undefined, uiID: undefined})) : undefined,
//         update: optionsChanged?.length ? optionsChanged.map((opt) => ({where: {option_id: opt.option_id}, data: {...opt, id:undefined, uiID: undefined, spec_id: undefined}})) : undefined,
//         deleteMany: optionsDeleted?.length ? optionsDeleted.map(({option_id}) => ({option_id: option_id})) : undefined
//       }
//     }
//   });
//   revalidatePath("/admin/specs", "page");
//   return response;
// }

export const upsertSpec = async (state:UISpec, init:UISpec):Promise<{spec_id: number}[]> => {
  const fields = {
    spec_id: state.spec_id || undefined,
    name_service: state.name_service,
    name_public: state.name_public,
    object_type: state.object_type,
    options_number: state.options_number,
  }
  const response = await db
    .insert(spec)
    .values({...fields})
    .onConflictDoUpdate({
      target: spec.spec_id,
      set: {...fields}
    })
    .returning({spec_id: spec.spec_id})
  return response;
}