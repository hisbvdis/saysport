"use client";
import clsx from "clsx";
import { createContext } from "react";
import type { City } from "@/drizzle/schema";
import { useRouter } from "next/navigation";
// -----------------------------------------------------------------------------
import { Card } from "../../ui/Card";
import { Select } from "../../ui/Select";
import { Control } from "../../ui/Control";
import { Sections, Filters, Results } from ".";
import { Pagination } from "../../ui/Pagination";
// -----------------------------------------------------------------------------
import { getCitiesByFilters } from "@/app/_db/city";
import type { DBObject, UISection } from "@/app/_types/types"
import { MapComponent, MapMarker } from "../../ui/MapComponent";
import type { SearchParamsType } from "@/app/(router)/catalog/page";
import { useManageSearchParams } from "@/app/_utils/useManageSearchParams";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function Catalog(props:Props) {
  const { searchParams, resultsLimited, resultsAll, sectionList, section, city, resultsCount } = props;
  const router = useRouter();
  const manageSearchParams = useManageSearchParams();

  return (
    <CatalogContext.Provider value={{searchParams, resultsLimited, sectionList, section, city, resultsCount, resultsAll}}>
      <div className={clsx(styles["catalog"], !searchParams.map && "container", "page")}>
        <aside>
          <Card>
            <Control>
              <Control.Label>Город</Control.Label>
              <Select
                isAutocomplete
                value={city?.city_id ? Number(city?.city_id) : ""}
                label={city?.name}
                onChange={(e) => {e.target.value ? router.push(manageSearchParams.set("city", e.target.value)) : router.push(manageSearchParams.delete(["city"]))}}
                placeholder="Введите название"
                requestItemsOnInputChange={async (value) => (
                  await getCitiesByFilters({name: value})).map((city) => ({
                    id: city.city_id, label: `${city.name}, ${city.country}, ${city.admin1 ?? ""}, ${city.admin2 ?? ""}`, data: city
                }))}
              />
            </Control>
          </Card>
          {searchParams.section ? <Filters className="mt10"/> : <Sections className="mt10"/>}
        </aside>
        <main className={styles["catalog__main"]}>
          <Results/>
          <Pagination itemsCount={resultsCount} pageSize={10} currentPage={searchParams.page ? Number(searchParams.page) : 1}/>
        </main>
        {searchParams.map &&
          <MapComponent className={styles["catalog__map"]} fitBoundsArray={resultsAll.map((object) => [object.coord_lat, object.coord_lon])}>
            {resultsAll.map((object) => <MapMarker key={object.object_id} coord={[object.coord_lat, object.coord_lon]}/>)}
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
  sectionList: UISection[];
  searchParams: SearchParamsType;
  city?: City;
  section?: UISection;
  resultsCount:number;
}

interface CatalogContextType {
  resultsLimited: DBObject[];
  resultsAll: DBObject[];
  resultsCount: number;
  searchParams: SearchParamsType;
  sectionList: UISection[];
  section?: UISection;
  city?: City;
}