"use client";
import { useRouter } from "next/navigation";
import type { City } from "@/drizzle/schema";
// -----------------------------------------------------------------------------
import { Modal } from "@/app/_components/ui/Modal";
import { Select } from "@/app/_components/ui/Select";
// -----------------------------------------------------------------------------
import { getCitiesByFilters } from "@/app/_db/city";
import { useManageSearchParams } from "@/app/_hooks/useManageSearchParams";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function SelectCityModal(props:Props) {
  const { isOpen, close, city } = props;
  const router = useRouter();
  const manageSearchParams = useManageSearchParams();

  return (
    <Modal className={styles["selectCityModal"]} isOpen={isOpen} close={close}>
      <Modal.Content className={styles["selectCityModal__content"]}>
        <Select
          className={styles["selectCityModal__select"]}
          isAutocomplete
          value={city?.city_id ? String(city?.city_id) : ""}
          label={city?.name}
          onChange={(data) => {
            data.value ? router.push(manageSearchParams.set("city", data.value, manageSearchParams.delete(["page"]))) : router.push(manageSearchParams.delete(["city"]));
            close();
          }}
          placeholder="Введите город"
          requestItemsOnInputChange={async (inputValue) => (
            await getCitiesByFilters({name: inputValue})).map((city) => ({
              id: city.city_id, label: `${city.name.concat(city.admin1 ? `, ${city.admin1}` : "").concat(city.country ? `, ${city.country}` : "")}`, data: city
          }))}
        />
      </Modal.Content>
    </Modal>
  )
}

interface Props {
  city?:City;
  isOpen: boolean;
  close: () => void;
}