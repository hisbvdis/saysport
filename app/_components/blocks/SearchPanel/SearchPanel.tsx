"use client";
import clsx from "clsx";
import { type SyntheticEvent, useContext, useState } from "react";
// -----------------------------------------------------------------------------
import { Form } from "../../ui/Form";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";
import { useRouter } from "next/navigation";
import { useManageSearchParams } from "@/app/_utils/useManageSearchParams";
import { CatalogContext } from "../../pages/Catalog/Catalog";


export default function SearchPanel() {
  const router = useRouter();
  const manageSearchParams = useManageSearchParams();
  const { searchParams } = useContext(CatalogContext);
  const [ searchText, setSearchText ] = useState<string>("");

  const handleClearButtonClick = (e) => {
    setSearchText("");
    router.push(manageSearchParams.delete("query"));
  }

  const handleFormSubmit = (e:SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    router.push(searchText ? manageSearchParams.set("query", searchText) : manageSearchParams.delete("query"));
  }

  return (
    <section className={styles["searchPanel"]}>
      <Form className={clsx("container", styles["searchPanel__container"])} onSubmit={handleFormSubmit}>
        <Input value={searchText} onChangeValue={setSearchText}/>
        {searchText && <Button onClick={handleClearButtonClick}>X</Button>}
        <Button type="submit">Поиск</Button>
      </Form>
    </section>
  )
}