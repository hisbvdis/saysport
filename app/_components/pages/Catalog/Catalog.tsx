"use client";
import cx from "classix";
import { createContext } from "react";
import type { City } from "@/drizzle/schema";
import type { SearchParamsType } from "@/app/_types/searchParams";
import type { DBObject, ProcessedDBCategory, ProcessedDBSection } from "@/app/_types/db"
// -----------------------------------------------------------------------------
import { Filters, Results } from ".";
import { Pagination } from "@/app/_components/ui/Pagination";
import { Categories } from "@/app/_components/blocks/Categories";
import { MapComponent } from "@/app/_components/ui/MapComponent";
import { CitySelector } from "@/app/_components/blocks/CitySelector";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function Catalog(props:Props) {
  const { searchParams, results, section, city, commonSections, categories } = props;

  return (
    <CatalogContext.Provider value={{searchParams, results, section, city, commonSections}}>
      <div className={cx(styles["catalog"], "container")}>
        <aside className={styles["catalog__aside"]}>
          <CitySelector className={styles["home__city"]} city={city}/>
          {searchParams.section ? <Filters/> : <Categories categories={categories}/>}
        </aside>
        <main className={styles["catalog__main"]}>
          <Results/>
          <Pagination itemsCount={results.totalCount ?? 0} pageSize={10} currentPage={searchParams.page ? Number(searchParams.page) : 1}/>
        </main>
        {searchParams.map &&
          <MapComponent className={styles["catalog__map"]} fitBoundsArray={results.unlimited?.map((object) => [object.coord_lat, object.coord_lon])}>
            {/* <MapCluster markersData={results.unlimited?.map((object) => ({coord: [object.coord_lat, object.coord_lon], popup: `<a href="object/${object.object_id}">${object.name_type.concat(object.name_title ? ` «${object.name_title}»` : "").concat(object.name_where ? ` ${object.name_where}` : "")}</a>`})) ?? []}/> */}
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
  section?: ProcessedDBSection;
  commonSections:ProcessedDBSection[];
  categories: ProcessedDBCategory[];
}

interface CatalogContextType {
  results: {
    requested: DBObject[];
    unlimited?: DBObject[];
    totalCount?: number;
  }
  searchParams: SearchParamsType;
  section?: ProcessedDBSection;
  city?: City;
  commonSections:ProcessedDBSection[];
}