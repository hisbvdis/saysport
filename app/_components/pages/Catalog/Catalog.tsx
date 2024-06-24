"use client";
import clsx from "clsx";
import { createContext } from "react";
import { city } from "@prisma/client";
import { useRouter } from "next/navigation";
// -----------------------------------------------------------------------------
import { Card } from "../../ui/Card";
import { Select } from "../../ui/Select";
import { Control } from "../../ui/Control";
import { Categories, Filters, Results } from ".";
// -----------------------------------------------------------------------------
import { getCitiesByFilters } from "@/app/_db/city";
import { DBObject, UISection } from "@/app/_types/types"
import { SearchParamsType } from "@/app/(router)/catalog/page";
import { useManageSearchParams } from "@/app/_utils/useManageSearchParams";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function Catalog(props:Props) {
  const { searchParams, results, sectionList, section, city } = props;
  const router = useRouter();
  const manageSearchParams = useManageSearchParams();

  return (
    <CatalogContext.Provider value={{searchParams, results, sectionList, section, city}}>
      <div className={clsx(styles["catalog"], "container", "page")}>
        <aside>
          <Card>
            <Control>
              <Control.Label>Город</Control.Label>
              <Select
                isAutocomplete
                value={city?.id ? Number(city?.id) : ""}
                label={city?.name}
                onChange={(e) => router.push(manageSearchParams.set("city", e.target.value))}
                placeholder="Введите название"
                requestItemsOnInputChange={async (value) => (
                  await getCitiesByFilters({name: value})).map((city) => ({
                    id: city.id, label: `${city.name}, ${city.country}, ${city.admin1 ?? ""}, ${city.admin2 ?? ""}`, data: city
                }))}
              />
            </Control>
          </Card>
          {searchParams.section ? <Filters className="mt10"/> : <Categories className="mt10"/>}
        </aside>
        <main>
          <Results/>
        </main>
      </div>
    </CatalogContext.Provider>
  )
}

export const CatalogContext = createContext<CatalogContextType>({} as CatalogContextType);

interface Props {
  results: DBObject[];
  sectionList: UISection[];
  searchParams: SearchParamsType;
  city?: city;
  section?: UISection;
}

interface CatalogContextType {
  results: DBObject[];
  searchParams: SearchParamsType;
  sectionList: UISection[];
  section?: UISection;
  city?: city;
}