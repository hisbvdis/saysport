"use server";
import { prisma } from "@/prisma/dbClient";
import { city } from "@prisma/client";

export const getCitiesByFilters = async (filters:{name?:string}):Promise<city[]> => {
  const dbData = await prisma.$queryRawUnsafe(`
    SELECT
      *
    FROM
      city
    WHERE
      name ilike '${filters?.name}%'
    ORDER BY
      length(name),
      name
    LIMIT 25
  `) as city[];
  return dbData;
}

export const getCityById = async (id:number):Promise<city> => {
  const dbData = await prisma.city.findUnique({
    where: {
      city_id: id
    }
  }) as city;
  return dbData;
}