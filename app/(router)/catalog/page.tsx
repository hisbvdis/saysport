import { Catalog } from "@/app/_components/pages/Catalog";
import { getCityById } from "@/app/_db/city";
import { getObjectsCountByFilters, getObjectsByFilters } from "@/app/_db/object"
import { getAllSections, getSectionById } from "@/app/_db/section";

export default async function CatalogPage({searchParams}:{searchParams:SearchParamsType}) {
  const city = searchParams.city ? await getCityById(Number(searchParams.city)) : undefined;
  const section = searchParams.section ? await getSectionById(Number(searchParams.section)) : undefined;
  const sectionList = await getAllSections();
  const results = await getObjectsByFilters(searchParams);
  const resultsCount = (await getObjectsCountByFilters(searchParams))[0].count;

  return (
    <Catalog
      searchParams={searchParams}
      city={city}
      sectionList={sectionList}
      results={results}
      resultsCount={resultsCount}
      section={section}
    />
  )
}

export interface SearchParamsType {
  city?:string;
  section?:string;
  options?:string;
  map?:boolean;
  photo?:string;
  status?:string;
  query:string;
  page?:string;
}