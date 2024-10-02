import type { MetadataRoute } from "next";
// -----------------------------------------------------------------------------
import { db } from "@/drizzle/client";
import { object } from "@/drizzle/schema";
// -----------------------------------------------------------------------------


export async function generateSitemaps() {
  return [{id: "objects"}]
}

export default async function sitemap({id}: {id:string}):Promise<MetadataRoute.Sitemap> {
  const objects = await db.select({object_id: object.object_id, modified: object.modified}).from(object);
  return objects.map((object) => ({
    url: `https://saysport.info/object/${object.object_id}`,
    lastModified: object.modified
  }))
}