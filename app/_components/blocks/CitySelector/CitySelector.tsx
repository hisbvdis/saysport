"use client";
import { useRouter } from "next/navigation";
import type { City } from "@/drizzle/schema";
// -----------------------------------------------------------------------------
import { Select } from "../../ui/Select";
import { Card } from "@/app/_components/ui/Card"
import { Control } from "@/app/_components/ui/Control"
import { SelectOld } from "@/app/_components/ui/SelectOld"
// -----------------------------------------------------------------------------
import { getCitiesByFilters } from "@/app/_db/city";
import { useManageSearchParams } from "@/app/_hooks/useManageSearchParams";
import Popover from "../../ui/Popover/Popover";
// -----------------------------------------------------------------------------
import { useDisclosure } from "@/app/_hooks/useDisclosure";
import PopoverRoot from "../../ui/Popover/PopoverRoot";
import PopoverContent from "../../ui/Popover/PopoverContent";



export default function CitySelector(props:{className?:string;city?:City}) {
  const { city } = props;
  const router = useRouter();
  const manageSearchParams = useManageSearchParams();
  const { open: openPopover, close: closePopover, isOpen: isOpenPopover } = useDisclosure();
  const { open: openModal, close: closeModal, isOpen: isOpenModal } = useDisclosure();

  return (
    <Card>
      <Control>
        <Control.Label>Город</Control.Label>
        <SelectOld
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
      <Select
        isAutocomplete
        label={city?.name}
        placeholder="Введите город"
        value={city?.city_id ? String(city?.city_id) : ""}
        onChange={(data) => {data.value ? router.push(manageSearchParams.set("city", data.value, manageSearchParams.delete(["page"]))) : router.push(manageSearchParams.delete(["city"]))}}
      />
      <Select
        label={city?.name}
        placeholder="Введите город"
        value={city?.city_id ? String(city?.city_id) : ""}
        onChange={(data) => {data.value ? router.push(manageSearchParams.set("city", data.value, manageSearchParams.delete(["page"]))) : router.push(manageSearchParams.delete(["city"]))}}
      />

      <button type="button" onClick={openPopover}>Popover</button>
      <PopoverRoot isOpen={isOpenPopover} close={closePopover}>
        <PopoverContent>
          <h1>Hello worlds</h1>
        </PopoverContent>
      </PopoverRoot>

      <button type="button" onClick={openModal}>Modal</button>
      <PopoverRoot isOpen={isOpenModal} close={closeModal} isModal={true}>
        <PopoverContent>
          <h1>Hello worlds</h1>
        </PopoverContent>
      </PopoverRoot>
    </Card>
  )
}