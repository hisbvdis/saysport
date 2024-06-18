"use server";
import { prisma } from "@/prisma/dbClient"
import { $Enums, object as object_ } from "@prisma/client"
// -----------------------------------------------------------------------------
import { UIObject } from "../_types/types";
import { objectReadProcessing } from "./object.processing";


export const getEmptyObject = async ():Promise<UIObject> => {
  return {
    type: $Enums.objectTypeEnum.org as $Enums.objectTypeEnum,
    status: $Enums.objectStatusEnum.works as $Enums.objectStatusEnum,
    schedule: Array(7).fill(null).map((_,i) => ({ id: -1, object_id: -1, day_num: i, time: "", from: 0, to: 0, uiID: crypto.randomUUID(), isWork: false })),
  }
}

export const getObjectsByFilters = async (filters:Filters) => {
  const { query, cityId, type } = filters;
  const dbData = await prisma.object.findMany({
    where: {
      name: query ? {contains: query, mode: "insensitive"} : undefined,
      city_id: cityId,
      type: type,
    },
    include: {
      statusInstead: true,
      city: true,
      parent: true,
      phones: {orderBy: {order: "asc"}},
      links: {orderBy: {order: "asc"}},
      options: {include: {option: true}},
      schedule: true,
      photos: {orderBy: {order: "asc"}},
    }
  });
  return dbData;
}

interface Filters {
  cityId?: number | null;
  type?: $Enums.objectTypeEnum;
  query?: string;
}

export const getObjectById = async (id:number) => {
  const dbData = await prisma.object.findUnique({
    where: {
      id: id
    },
    include: {
      statusInstead: true,
      city: true,
      parent: true,
      phones: {orderBy: {order: "asc"}},
      links: {orderBy: {order: "asc"}},
      sections: {include: {section: {include: {specs: {include: {spec: {include: {options: true}}}}}}}},
      options: {include: {option: true}},
      schedule: true,
      photos: {orderBy: {order: "asc"}},
    }
  });
  if (dbData === null) throw new Error("getObjectById returned null");
  const processed = await objectReadProcessing(dbData);
  return processed;
}

export const deleteObjectById = async (id:number) => {
  await prisma.object.delete({
    where: {
      id: id
    }
  })
}

export const upsertObject = async (state:UIObject, init: UIObject): Promise<object_> => {
  // if (!state.city_id) throw new Error("upsertObject");
  const fields = {
    name: state.name!,
    name_locative: state.name_locative || null,
    name_where: state.name_where || null,
    type: state.type!,
    status: state.status || null,
    status_inherit: state.status_inherit || null,
    status_comment: state.status_comment || null,
    status_confirm: state.status_confirm || null,
    status_instead_id: state.status_instead_id || null,
    city_id: state.city_id || null,
    parent_id: state.parent_id || null,
    address: state.address || null,
    address_2: state.address_2 || null,
    coord_inherit: state.coord_inherit || null,
    coord_lat: state.coord_lat || null,
    coord_lon: state.coord_lon || null,
    description: state.description || null,
    schedule_inherit: state.schedule_inherit || null,
    schedule_24_7: state.schedule_24_7 || null,
    schedule_date: state.schedule_date || null,
    schedule_source: state.schedule_source || null,
    schedule_comment: state.schedule_comment || null,
  };
  const phonesAdded = state.phones?.filter((statePhone) => !init?.phones?.some((initPhone) => statePhone.uiID === initPhone.uiID && statePhone.value !== ""));
  const phonesChanged = state.phones?.filter((statePhone) => init.phones?.some((initPhone) => statePhone.uiID === initPhone.uiID && (statePhone.value !== initPhone.value || statePhone.comment !== initPhone.comment)));
  const phonesDeleted = init.phones?.filter((initPhone) => !state.phones?.some((statePhone) => initPhone.uiID === statePhone.uiID));
  const linksAdded = state.links?.filter((stateLink) => !init?.links?.some((initLink) => stateLink.uiID === initLink.uiID && stateLink.value !== ""));
  const linksChanged = state.links?.filter((stateLink) => init.links?.some((initLink) => stateLink.uiID === initLink.uiID && (stateLink.value !== initLink.value || stateLink.comment !== initLink.comment)));
  const linksDeleted = init.links?.filter((initLink) => !state.links?.some((stateLink) => initLink.uiID === stateLink.uiID));
  const optionsAdded = state.options?.filter((stateOption) => !init?.options?.some((initOption) => stateOption.id === initOption.id));
  const optionsDeleted = init.options?.filter((initOption) => !state.options?.some((stateOption) => initOption.id === stateOption.id));
  const sectionsAdded = state.sections?.filter((stateSection) => !init?.sections?.some((initSection) => stateSection.id === initSection.id));
  const sectionsDeleted = init.sections?.filter((initSection) => !state.sections?.some((stateSection) => initSection.id === stateSection.id));
  const scheduleAdded = state.schedule?.filter((stateDay) => init.schedule?.some((initDay) => stateDay.day_num === initDay.day_num && !initDay.time && stateDay.time));
  const scheduleChanged = state.schedule?.filter((stateDay) => init.schedule?.some((initDay) => stateDay.day_num === initDay.day_num && initDay.id !== -1 && stateDay.time && stateDay.time !== initDay.time));
  const scheduleDeleted = init.schedule?.filter((initDay) => state.schedule?.some((stateDay) => initDay.day_num === stateDay.day_num && initDay.time && !stateDay.time));
  const photosAdded = state.photos?.filter((statePhoto) => !init?.photos?.some((initPhoto) => statePhoto.uiID === initPhoto.uiID));
  const photosDeleted = init.photos?.filter((initPhoto) => !state.photos?.some((statePhoto) => initPhoto.uiID === statePhoto.uiID));
  // const photosMoved = state.photos?.filter((statePhoto) => init.photos?.some((initPhoto) => statePhoto.localId === initPhoto.localId && statePhoto.order !== initPhoto.order));
  const addedObject = await prisma.object.upsert({
    where: {
      id: state.id ?? -1
    },
    create: {
      ...fields,
      phones: {
        create: phonesAdded?.length ? phonesAdded.map((item) => ({...item, id: undefined, uiID: undefined, object_id: undefined})) : undefined,
      },
      links: {
        create: linksAdded?.length ? linksAdded.map((item) => ({...item, id: undefined, uiID: undefined, object_id: undefined})) : undefined,
      },
      options: {
        create: optionsAdded?.length ? optionsAdded.map(({id}) => ({option: {connect: {id}}})) : undefined,
      },
      sections: {
        create: sectionsAdded?.length ? sectionsAdded.map(({id}) => ({section: {connect: {id}}})) : undefined,
      },
      schedule: {
        create: scheduleAdded?.length ? scheduleAdded.map((day) => ({...day, id: undefined, object_id: undefined, uiID: undefined, isWork: undefined})) : undefined,
      },
      photos: {
        // Don't: The
      },
      created: new Date(),
    },
    update: {
      ...fields,
      phones: {
        create: phonesAdded?.length ? phonesAdded.map((item) => ({...item, id: undefined, uiID: undefined, object_id: undefined})) : undefined,
        update: phonesChanged?.length ? phonesChanged.map((item) => ({where: {id: item.id}, data: {...item, id: undefined, uiID: undefined, object_id: undefined}})) : undefined,
        deleteMany: phonesDeleted?.length ? phonesDeleted.map((item) => ({...item, uiID: undefined})) : undefined,
      },
      links: {
        create: linksAdded?.length ? linksAdded.map((item) => ({...item, id: undefined, uiID: undefined, object_id: undefined})) : undefined,
        update: linksChanged?.length ? linksChanged.map((item) => ({where: {id: item.id}, data: {...item, id: undefined, uiID: undefined, object_id: undefined}})) : undefined,
        deleteMany: linksDeleted?.length ? linksDeleted.map((item) => ({...item, uiID: undefined})) : undefined,
      },
      options: {
        create: optionsAdded?.length ? optionsAdded.map(({id}) => ({option: {connect: {id}}})) : undefined,
        deleteMany: optionsDeleted?.length ? {option_id: {in: optionsDeleted.map(({id}) => id!)}} : undefined,
      },
      sections: {
        create: sectionsAdded?.length ? sectionsAdded.map(({id}) => ({section: {connect: {id}}})) : undefined,
        deleteMany: sectionsDeleted?.length ? {section_id: {in: sectionsDeleted.map(({id}) => id!)}} : undefined,
      },
      schedule: {
        create: scheduleAdded?.length ? scheduleAdded.map((day) => ({...day, id: undefined, object_id: undefined, uiID: undefined, isWork: undefined})) : undefined,
        update: scheduleChanged?.length ? scheduleChanged.map((day) => ({where: {id: day.id}, data: {...day, id: undefined, object_id: undefined, uiID: undefined, isWork: undefined}})) : undefined,
        deleteMany: scheduleDeleted?.length ? {id: {in: scheduleDeleted.map(({id}) => id)}} : undefined,
      },
      photos: {
        create: photosAdded?.length ? photosAdded.map(({name, order}) => ({name, order})) : undefined,
        // update: photosMoved?.length ? photosMoved.map((photo) => ({where: {id: photo.id}, data: {order: photo.order}})) : undefined,
        deleteMany: photosDeleted?.length ? {id: {in: photosDeleted.map(({id}) => id)}} : undefined,
      },
    }
  });
   // Rename photo names of created object
   if (!state.id && state.photos?.length) {
    const updatedObject = await prisma.object.update({
      where: {id: addedObject.id},
      data: {
        photos: {
          create: state.photos.map(({name, order}) => ({ name: name.replace("ID", String(addedObject.id)),order})),
        }
      },
    });
    return updatedObject;
  };
  return addedObject
}