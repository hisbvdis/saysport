"use client";
import clsx from "clsx";
import { createContext } from "react";
import type { City } from "@/drizzle/schema";
import { useRouter } from "next/navigation";
// -----------------------------------------------------------------------------
import { Card } from "../../ui/Card";
import { Select } from "../../ui/Select";
import { Control } from "../../ui/Control";
import { Categories, Filters, Results } from ".";
// -----------------------------------------------------------------------------
import { getCitiesByFilters } from "@/app/_db/city";
import { MapComponent, Marker } from "../../ui/MapComponent";
import type { DBObject, UISection } from "@/app/_types/types"
import type { SearchParamsType } from "@/app/(router)/catalog/page";
import { useManageSearchParams } from "@/app/_utils/useManageSearchParams";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function Catalog(props:Props) {
  const { searchParams, results, sectionList, section, city } = props;
  const router = useRouter();
  const manageSearchParams = useManageSearchParams();

  return (
    <CatalogContext.Provider value={{searchParams, results, sectionList, section, city}}>
      <div className={clsx(styles["catalog"], !searchParams.map && "container", "page")}>
        <aside>
          <Card>
            <Control>
              <Control.Label>Город</Control.Label>
              <Select
                isAutocomplete
                value={city?.city_id ? Number(city?.city_id) : ""}
                label={city?.name}
                onChange={(e) => {e.target.value ? router.push(manageSearchParams.set("city", e.target.value)) : router.push(manageSearchParams.delete("city"))}}
                placeholder="Введите название"
                requestItemsOnInputChange={async (value) => (
                  await getCitiesByFilters({name: value})).map((city) => ({
                    id: city.city_id, label: `${city.name}, ${city.country}, ${city.admin1 ?? ""}, ${city.admin2 ?? ""}`, data: city
                }))}
              />
            </Control>
          </Card>
          {searchParams.section ? <Filters className="mt10"/> : <Categories className="mt10"/>}
        </aside>
        <main>
          <Results/>
        </main>
        <aside>
          {searchParams.map &&
            <MapComponent fitBoundsArray={results.map((object) => [object.coord_lat, object.coord_lon])}>
              {results.map((object) => <Marker key={object.object_id} coord={[object.coord_lat, object.coord_lon]}/>)}
            </MapComponent>
          }
        </aside>
      </div>
    </CatalogContext.Provider>
  )
}

export const CatalogContext = createContext<CatalogContextType>({} as CatalogContextType);

interface Props {
  results: DBObject[];
  sectionList: UISection[];
  searchParams: SearchParamsType;
  city?: City;
  section?: UISection;
}

interface CatalogContextType {
  results: DBObject[];
  searchParams: SearchParamsType;
  sectionList: UISection[];
  section?: UISection;
  city?: City;
}