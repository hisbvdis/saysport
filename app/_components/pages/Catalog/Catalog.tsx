"use client";
import clsx from "clsx";
import { createContext } from "react";
import { useRouter } from "next/navigation";
import type { City } from "@/drizzle/schema";
import type { DBObject, ProcCategory, ProcSection } from "@/app/_types/types"
// -----------------------------------------------------------------------------
import { Card } from "../../ui/Card";
import { Select } from "../../ui/Select";
import { Control } from "../../ui/Control";
import { Filters, Results, Categories } from ".";
import { Pagination } from "../../ui/Pagination";
import { MapCluster } from "../../ui/MapComponent";
// -----------------------------------------------------------------------------
import { getCitiesByFilters } from "@/app/_db/city";
import { MapComponent } from "../../ui/MapComponent";
import type { SearchParamsType } from "@/app/(router)/page";
import { useManageSearchParams } from "@/app/_utils/useManageSearchParams";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function Catalog(props:Props) {
  const { searchParams, resultsLimited, resultsAll, categories, section, city, resultsCount, commonSections } = props;
  const router = useRouter();
  const manageSearchParams = useManageSearchParams();

  return (
    <CatalogContext.Provider value={{searchParams, resultsLimited, categories, section, city, resultsCount, resultsAll, commonSections}}>
      <div className={clsx(styles["catalog"], !searchParams.map && "container", "page")}>
        <aside>
          <Card>
            <Control>
              <Control.Label>Город</Control.Label>
              <Select
                isAutocomplete
                value={city?.city_id ? String(city?.city_id) : ""}
                label={city?.name}
                onChange={(data) => {data.value ? router.push(manageSearchParams.set("city", data.value)) : router.push(manageSearchParams.delete(["city"]))}}
                placeholder="Введите название"
                requestItemsOnInputChange={async (value) => (
                  await getCitiesByFilters({name: value})).map((city) => ({
                    id: city.city_id, label: `${city.name}, ${city.country}, ${city.admin1 ?? ""}, ${city.admin2 ?? ""}`, data: city
                }))}
              />
            </Control>
          </Card>
          {searchParams.section ? <Filters/> : <Categories/>}
        </aside>
        <main className={styles["catalog__main"]}>
          <Results/>
          <Pagination itemsCount={resultsCount} pageSize={10} currentPage={searchParams.page ? Number(searchParams.page) : 1}/>
        </main>
        {searchParams.map &&
          <MapComponent className={styles["catalog__map"]} fitBoundsArray={resultsAll.map((object) => [object.coord_lat, object.coord_lon])}>
            <MapCluster markersData={resultsAll?.map((object) => ({coord: [object.coord_lat, object.coord_lon], popup: `<a href="object/${object.object_id}">${object.name_type.concat(object.name_title ? ` «${object.name_title}»` : "").concat(object.name_where ? ` ${object.name_where}` : "")}</a>`}))}/>
          </MapComponent>
        }
      </div>
    </CatalogContext.Provider>
  )
}

export const CatalogContext = createContext<CatalogContextType>({} as CatalogContextType);

interface Props {
  resultsLimited: DBObject[];
  resultsAll: DBObject[];
  categories: ProcCategory[];
  searchParams: SearchParamsType;
  city?: City;
  section?: ProcSection;
  resultsCount:number;
  commonSections:ProcSection[];
}

interface CatalogContextType {
  resultsLimited: DBObject[];
  resultsAll: DBObject[];
  resultsCount: number;
  searchParams: SearchParamsType;
  categories: ProcCategory[];
  section?: ProcSection;
  city?: City;
  commonSections:ProcSection[];
}