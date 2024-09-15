"use client";
import { useRouter } from "next/navigation";
import type { City } from "@/drizzle/schema";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card"
import { Select } from "@/app/_components/ui/Select"
import { Control } from "@/app/_components/ui/Control"
// -----------------------------------------------------------------------------
import { getCitiesByFilters } from "@/app/_db/city";
import { useManageSearchParams } from "@/app/_hooks/useManageSearchParams";
// -----------------------------------------------------------------------------


export default function CitySelector(props:{className?:string;city?:City}) {
  const { city } = props;
  const router = useRouter();
  const manageSearchParams = useManageSearchParams();

  return (
    <Card>
      <Control>
        <Control.Label>Город</Control.Label>
        <Select
          isAutocomplete
          value={city?.city_id ? String(city?.city_id) : ""}
          label={city?.name}
          onChange={(data) => {data.value ? router.push(manageSearchParams.set("city", data.value, manageSearchParams.delete(["page"]))) : router.push(manageSearchParams.delete(["city"]))}}
          placeholder="Введите город"
          requestItemsOnInputChange={async (inputValue) => (
            await getCitiesByFilters({name: inputValue})).map((city) => ({
              id: city.city_id, label: `${city.name.concat(city.admin1 ? `, ${city.admin1}` : "").concat(city.country ? `, ${city.country}` : "")}`, data: city
          }))}
        />
      </Control>
    </Card>
  )
}

