"use server";
import { db } from "@/drizzle/client";
import { eq, ilike, sql } from "drizzle-orm";
import { type City, city } from "@/drizzle/schema";
// -----------------------------------------------------------------------------


export const getCitiesByFilters = async (filters:{name?:string}):Promise<City[]> => {
  const cityName = filters?.name;
  const dbData = await db
    .select()
    .from(city)
    .where(cityName ? ilike(city.name, `${cityName}%`) : undefined)
    .orderBy(sql`length(${city.name}), ${city.name}, ${city.country.name}, ${city.admin1}`)
    .limit(25)
  return dbData;
}

export const getCityById = async (id:number):Promise<City> => {
  const dbData = await db.query.city.findFirst({
    where: eq(city.city_id, id)
  })
  if (dbData === undefined) throw new Error("getCityById returned undefined");
  return dbData;
}