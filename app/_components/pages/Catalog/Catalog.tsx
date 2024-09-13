"use client";
import clsx from "clsx";
import { createContext } from "react";
import type { City } from "@/drizzle/schema";
import type { DBObject, ProcSection, SearchParamsType } from "@/app/_types/types"
// -----------------------------------------------------------------------------
import { Filters, Results } from ".";
import { Pagination } from "../../ui/Pagination";
import { MapCluster } from "../../ui/MapComponent";
import { MapComponent } from "../../ui/MapComponent";
import { CitySelector } from "../../blocks/CitySelector";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function Catalog(props:Props) {
  const { searchParams, results, section, city, commonSections } = props;

  return (
    <CatalogContext.Provider value={{searchParams, results, section, city, commonSections}}>
      <div className={clsx(styles["catalog"], "container", "page")}>
        <aside className={styles["catalog__aside"]}>
          <CitySelector className={styles["home__city"]} city={city}/>
          <Filters/>
        </aside>
        <main className={styles["catalog__main"]}>
          <Results/>
          <Pagination itemsCount={results.totalCount ?? 0} pageSize={10} currentPage={searchParams.page ? Number(searchParams.page) : 1}/>
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
  section?: ProcSection;
  city?: City;
  commonSections:ProcSection[];
}