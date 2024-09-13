import type { Metadata } from "next";
import type { SearchParamsType } from "@/app/_types/types";
import { objectTypeEnum, sectionTypeEnum } from "@/drizzle/schema";
// -----------------------------------------------------------------------------
import { Catalog } from "@/app/_components/pages/Catalog";
// -----------------------------------------------------------------------------
import { getCityById } from "@/app/_db/city";
import { getObjectsByFilters } from "@/app/_db/object"
import { getSectionById, getSectionsByFilters } from "@/app/_db/section";
// -----------------------------------------------------------------------------


export default async function HomePage({searchParams}:Props) {
  const city = searchParams.city ? await getCityById(Number(searchParams.city)) : undefined;
  const section = Number(searchParams.section) ? await getSectionById(Number(searchParams.section)) : undefined;
  const results = section || searchParams.section === "all" ? await getObjectsByFilters({...searchParams, limit: 10, withTotalCount: true, withUnlimited: true}) : {requested: [], unlimited: [], totalCount: 0};
  const commonSections = section?.object_type === objectTypeEnum.place ? await getSectionsByFilters({objectType: objectTypeEnum.place, sectionType: sectionTypeEnum.common}) : await getSectionsByFilters({objectType: objectTypeEnum.class, sectionType: sectionTypeEnum.common});

  return (
    <Catalog
      searchParams={searchParams}
      city={city}
      section={section}
      commonSections={commonSections}
      results={results}
    />
  )
}


export async function generateMetadata({searchParams}:Props):Promise<Metadata> {
  const city = searchParams.city ? await getCityById(Number(searchParams.city)) : undefined;
  const section = Number(searchParams.section) ? await getSectionById(Number(searchParams.section)) : undefined;
  const sectionName = searchParams.section ? section?.name_seo_title : null;
  const cityName = searchParams.city ? city?.name_preposition : null;
  const resultsCount = section || searchParams.section === "all" ? (await getObjectsByFilters({...searchParams, withTotalCount: true})).totalCount : 0;

  return {
    title: `${sectionName ? sectionName : "Спортивные объекты и секции"}${cityName ? ` в ${cityName}` : ""} | SaySport.info`,
    alternates: {
      canonical: (() => {
        const baseUrl = "/catalog";
        const searchParams = new URLSearchParams();
        if (!city) baseUrl;
        if (city) searchParams.append("city", String(city.city_id));
        if (section) searchParams.append("section", String(section.section_id));
        return baseUrl.concat(Array.from(searchParams.keys()).length ? "?" : "").concat(searchParams.toString());
      })(),
    },
    robots: {
      index: city && section && resultsCount && resultsCount > 0 ? undefined : false
    }
  }
}


interface Props {
  searchParams:SearchParamsType
}