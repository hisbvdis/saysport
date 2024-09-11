"use client";
import clsx from "clsx";
import { createContext } from "react";
import { useRouter } from "next/navigation";
import type { City } from "@/drizzle/schema";
import type { SearchParamsType } from "@/app/(router)/page";
import type { DBObject, ProcCategory, ProcSection } from "@/app/_types/types"
// -----------------------------------------------------------------------------
import { Card } from "../../ui/Card";
import { Select } from "../../ui/Select";
import { Control } from "../../ui/Control";
import { Filters, Results, Categories, Hero, PopularSections } from ".";
import { Pagination } from "../../ui/Pagination";
import { MapCluster } from "../../ui/MapComponent";
import { MapComponent } from "../../ui/MapComponent";
// -----------------------------------------------------------------------------
import { getCitiesByFilters } from "@/app/_db/city";
import { useManageSearchParams } from "@/app/_utils/useManageSearchParams";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function Catalog(props:Props) {
  const { searchParams, results, categories, section, city, commonSections } = props;
  const router = useRouter();
  const manageSearchParams = useManageSearchParams();

  return (
    <CatalogContext.Provider value={{searchParams, results, categories, section, city, commonSections}}>
      <div className={clsx(styles["catalog"], "container", styles["catalog__container"], "page", styles["catalog__page"])}>
        {searchParams.section ? null : <Hero className={styles["catalog__hero"]}/>}
        <aside className={styles["catalog__aside"]}>
          <Card className={styles["catalog__city"]}>
            <Control>
              <Control.Label>Город</Control.Label>
              <Select
                isAutocomplete
                value={city?.city_id ? String(city?.city_id) : ""}
                label={city?.name}
                onChange={(data) => {data.value ? router.push(manageSearchParams.set("city", data.value, manageSearchParams.delete(["page"]))) : router.push(manageSearchParams.delete(["city"]))}}
                placeholder="Введите название"
                requestItemsOnInputChange={async (inputValue) => (
                  await getCitiesByFilters({name: inputValue})).map((city) => ({
                    id: city.city_id, label: `${city.name.concat(city.admin1 ? `, ${city.admin1}` : "").concat(city.country ? `, ${city.country}` : "")}`, data: city
                }))}
              />
            </Control>
          </Card>
          {searchParams.section ? <Filters/> : <Categories/>}
        </aside>
        <main className={styles["catalog__main"]}>
          {searchParams.section ? (<>
            <Results/>
            <Pagination itemsCount={results.totalCount ?? 0} pageSize={10} currentPage={searchParams.page ? Number(searchParams.page) : 1}/>
          </>) : (
            <PopularSections/>
          )}
        </main>
        {searchParams.map &&
          <MapComponent className={styles["catalog__map"]} fitBoundsArray={results.unlimited?.map((object) => [object.coord_lat, object.coord_lon])}>
            <MapCluster markersData={results.unlimited?.map((object) => ({coord: [object.coord_lat, object.coord_lon], popup: `<a href="object/${object.object_id}">${object.name_type.concat(object.name_title ? ` «${object.name_title}»` : "").concat(object.name_where ? ` ${object.name_where}` : "")}</a>`})) ?? []}/>
          </MapComponent>
        }
      </div>
    </CatalogContext.Provider>
  )
}

export const CatalogContext = createContext<CatalogContextType>({} as CatalogContextType);

interface Props {
  results: {
    requested: DBObject[];
    unlimited?: DBObject[];
    totalCount?: number;
  }
  searchParams: SearchParamsType;
  categories: ProcCategory[];
  city?: City;
  section?: ProcSection;
  commonSections:ProcSection[];
}

interface CatalogContextType {
  results: {
    requested: DBObject[];
    unlimited?: DBObject[];
    totalCount?: number;
  }
  searchParams: SearchParamsType;
  categories: ProcCategory[];
  section?: ProcSection;
  city?: City;
  commonSections:ProcSection[];
}