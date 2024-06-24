import { Catalog } from "@/app/_components/pages/Catalog";
import { getCityById } from "@/app/_db/city";
import { getObjectsByFilters } from "@/app/_db/object"
import { getSectionById, getSectionsByFilters } from "@/app/_db/section";

export default async function CatalogPage({searchParams}:{searchParams:SearchParamsType}) {
  const city = searchParams.city ? await getCityById(Number(searchParams.city)) : undefined;
  const section = searchParams.section ? await getSectionById(Number(searchParams.section)) : undefined;
  const sectionList = await getSectionsByFilters();
  const results = await getObjectsByFilters(searchParams);

  return (
    <Catalog
      searchParams={searchParams}
      city={city}
      sectionList={sectionList}
      results={results}
      section={section}
    />
  )
}

export interface SearchParamsType {
  city?:string;
  section?:string;
  options?:string;
  map?:boolean;
}