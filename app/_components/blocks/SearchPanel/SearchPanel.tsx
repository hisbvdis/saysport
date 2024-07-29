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
import { CatalogContext } from "../../pages/Catalog/Catalog";
import { useManageSearchParams } from "@/app/_utils/useManageSearchParams";


export default function SearchPanel() {
  const router = useRouter();
  const manageSearchParams = useManageSearchParams();
  const { searchParams } = useContext(CatalogContext);
  const [ searchText, setSearchText ] = useState<string>(searchParams.query);

  const handleClearButtonClick = () => {
    setSearchText("");
    router.push(manageSearchParams.delete("query"));
  }

  const handleFormSubmit = (e:SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    router.push(searchText ? manageSearchParams.set("query", searchText) : manageSearchParams.delete("query"));
  }

  return (
    <Form className={clsx(styles["searchPanel"])} onSubmit={handleFormSubmit}>
      <Input value={searchText} onChangeValue={setSearchText} placeholder="Введите название"/>
      {searchText && <Button onClick={handleClearButtonClick}>X</Button>}
      <Button type="submit">Поиск</Button>
    </Form>
  )
}