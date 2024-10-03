"use client";
import { useRouter } from "next/navigation";
import type { City } from "@/drizzle/schema";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card"
import { Select } from "@/app/_components/ui/Select";
import { Control } from "@/app/_components/ui/Control"
import { PopoverDemo } from "../../primitives/Popover";
// -----------------------------------------------------------------------------
import { getCitiesByFilters } from "@/app/_actions/db/city";
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
        <Control.Section>
          <Select
            isAutocomplete
            name="auto"
            label={city?.name}
            placeholder="Введите город"
            value={city?.city_id ? String(city?.city_id) : ""}
            onChange={(data) => {data.value ? router.push(manageSearchParams.set("city", data.value, manageSearchParams.delete(["page"]))) : router.push(manageSearchParams.delete(["city"]))}}
            requestItemsOnInputChange={async (inputValue) => (
              await getCitiesByFilters({name: inputValue})).map((city) => ({
                id: String(city.city_id), label: `${city.name.concat(city.admin1 ? `, ${city.admin1}` : "").concat(city.country ? `, ${city.country}` : "")}`, data: city
            }))}
          />
        </Control.Section>
      </Control>
      <PopoverDemo isModal>
        <h1>Hello world</h1>
      </PopoverDemo>
    </Card>
  )
}