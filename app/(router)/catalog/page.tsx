import { Catalog } from "@/app/_components/pages/Catalog";
import { getObjectsByFilters } from "@/app/_db/object"

export default async function CatalogPage() {
  const results = await getObjectsByFilters();

  return (
    <Catalog results={results}/>
  )
}