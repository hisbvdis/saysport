"use client";
import cx from "classix";
import { type SyntheticEvent, use, useEffect, useState } from "react";
// -----------------------------------------------------------------------------
import { Input } from "@/app/_components/ui/Input";
import { Button } from "@/app/_components/ui/Button";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";
import { useRouter } from "next/navigation";
import { CatalogContext } from "@/app/_components/pages/Catalog/Catalog";
import { useManageSearchParams } from "@/app/_hooks/useManageSearchParams";


export default function SearchPanel() {
  const router = useRouter();
  const manageSearchParams = useManageSearchParams();
  const { searchParams } = use(CatalogContext);
  const [ searchText, setSearchText ] = useState<string>(searchParams.query);

  const handleClearButtonClick = () => {
    setSearchText("");
    router.push(manageSearchParams.delete(["query", "page"]));
  }

  const handleFormSubmit = (e:SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    const paramsWithoutPageParam = manageSearchParams.delete(["page"]);
    router.push(searchText ? manageSearchParams.set("query", searchText, paramsWithoutPageParam) : manageSearchParams.delete(["query"]));
  }

  useEffect(() => {setSearchText(searchParams.query)}, [searchParams.query])

  return (
    <form className={cx(styles["searchPanel"])} onSubmit={handleFormSubmit}>
      <Input value={searchText} onChangeValue={setSearchText} placeholder="Введите название"/>
      {searchText && <Button onClick={handleClearButtonClick}>X</Button>}
      <Button type="submit">Поиск</Button>
    </form>
  )
}