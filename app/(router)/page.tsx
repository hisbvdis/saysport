import type { Metadata } from "next";
import { objectTypeEnum, sectionTypeEnum } from "@/drizzle/schema";
// -----------------------------------------------------------------------------
import { Catalog } from "@/app/_components/pages/Catalog";
// -----------------------------------------------------------------------------
import { getCityById } from "@/app/_db/city";
import { getAllCategories } from "@/app/_db/category";
import { getSectionById, getSectionsByFilters } from "@/app/_db/section";
import { getObjectsCountByFilters, getObjectsByFilters } from "@/app/_db/object"
// -----------------------------------------------------------------------------


export default async function CatalogPage({searchParams}:Props) {
  const city = searchParams.city ? await getCityById(Number(searchParams.city)) : undefined;
  const section = searchParams.section ? await getSectionById(Number(searchParams.section)) : undefined;
  const categories = await getAllCategories();
  const resultsLimited = await getObjectsByFilters({...searchParams, limit: 10});
  const resultsAll = await getObjectsByFilters(searchParams);
  const resultsCount = (await getObjectsCountByFilters(searchParams))[0].count;
  const commonSections = section?.object_type === objectTypeEnum.place ? await getSectionsByFilters({objectType: objectTypeEnum.place, sectionType: sectionTypeEnum.common}) : await getSectionsByFilters({objectType: objectTypeEnum.class, sectionType: sectionTypeEnum.common});

  return (
    <Catalog
      searchParams={searchParams}
      city={city}
      categories={categories}
      resultsLimited={resultsLimited}
      resultsAll={resultsAll}
      resultsCount={resultsCount}
      section={section}
      commonSections={commonSections}
    />
  )
}

export async function generateMetadata({searchParams}:Props):Promise<Metadata> {
  const city = searchParams.city ? await getCityById(Number(searchParams.city)) : undefined;
  const section = searchParams.section ? await getSectionById(Number(searchParams.section)) : undefined;
  const sectionName = searchParams.section ? section?.name_seo_title : null;
  const cityName = searchParams.city ? city?.name_preposition : null;
  const resultsCount = (await getObjectsCountByFilters(searchParams))[0].count;

  return {
    title: `${sectionName ? sectionName : "Спортивные объекты и секции"}${cityName ? ` в ${cityName}` : ""} | SaySport.info`,
    alternates: {
      canonical: (() => {
        const baseUrl = "/";
        const searchParams = new URLSearchParams();
        if (city) searchParams.append("city", String(city.city_id));
        if (section) searchParams.append("section", String(section.section_id));
        return baseUrl.concat(Array.from(searchParams.keys()).length ? "?" : "").concat(searchParams.toString());
      })(),
    },
    robots: {
      index: resultsCount > 0 ? undefined : false
    }
  }
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
  days?:string;
  from?:string;
  to?:string;
  cost?:string;
  usages?:string;
  sex?:string;
  age?:string;
}

interface Props {
  searchParams:SearchParamsType
}