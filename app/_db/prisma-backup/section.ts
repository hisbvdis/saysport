"use server";
import { $Enums } from "@prisma/client";
import { prisma } from "@/prisma/dbClient";
import { revalidatePath } from "next/cache";
// -----------------------------------------------------------------------------
import { UISection } from "@/app/_types/types";
import { sectionReadProcessing } from "./section.processing";


// export const getSectionsByFilters = async (filters?:{objectType?:$Enums.objectTypeEnum}):Promise<UISection[]> => {
//   const objectType = filters?.objectType;
//   const dbData = await prisma.section.findMany({
//     where: {
//       object_type: objectType
//     },
//     include: {specs: {include: {spec: {include: {options: true}}}}},
//   })
//   const processed = dbData.map((section) => sectionReadProcessing(section));
//   return processed;
// }

// export const getSectionById = async (id:number):Promise<UISection> => {
//   const dbData = await prisma.section.findUnique({
//     where: {
//       section_id: id,
//     },
//     include: {
//       specs: {include: {spec: {include: {options: true}}}},
//     }
//   })

//   if (dbData === null) throw new Error("getSectionById returned null");
//   const processed = sectionReadProcessing(dbData);
//   return processed;
// }

// export const deleteSectionById = async (id:number):Promise<void> => {
//   await prisma.section.delete({
//     where: {
//       section_id: id
//     }
//   });
//   revalidatePath("/admin/sections");
// }

// export const getEmptySection = async ():Promise<UISection> => {
//   return {
//     section_id: -1,
//     object_type: "org" as $Enums.objectTypeEnum,
//     name_plural: "",
//     name_singular: "",
//     uiID: crypto.randomUUID(),
//     specs: [],
//   }
// }

// export const upsertSection = async (state:UISection, init: UISection) => {
//   const fields = {
//     name_plural: state.name_plural,
//     name_singular: state.name_singular,
//     object_type: state.object_type,
//   }
//   const specsAdded = state.specs?.filter((stateSpec) => !init.specs?.some((initSpec) => stateSpec.spec_id === initSpec.spec_id));
//   const specsDeleted = init.specs?.filter((initSpec) => !state.specs?.some((stateSpec) => initSpec.spec_id === stateSpec.spec_id));
//   const response = await prisma.section.upsert({
//     where: {
//       section_id: state?.section_id ?? -1
//     },
//     create: {
//       ...fields,
//       specs: {
//         create: specsAdded?.length ? specsAdded.map((spec) => ({spec: {connect: {spec_id: spec.spec_id}}})) : undefined,
//       }
//     },
//     update: {
//       ...fields,
//       specs: {
//         create: specsAdded?.length ? specsAdded.map((spec) => ({spec: {connect: {spec_id: spec.spec_id}}})) : undefined,
//         deleteMany: specsDeleted?.length ? specsDeleted.map((spec) => ({spec_id: spec.spec_id})) : undefined,
//       }
//     },
//   })
//   return response;
// }