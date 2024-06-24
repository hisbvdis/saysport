import Link from "next/link";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
import { Breadcrumbs } from "@/app/_components/ui/Breadcrumbs";
// -----------------------------------------------------------------------------
import { CatalogContext } from "../Catalog";
import { useManageSearchParams } from "@/app/_utils/useManageSearchParams";


export default function Results() {
  const { searchParams, city, results, section } = useContext(CatalogContext);
  const manageSearchParams = useManageSearchParams();

  return (
    <Card>
      <Card.Heading>
        <Breadcrumbs style={{marginBlockEnd: "5px"}} items={[
          {label: "Каталог", href: city || section ? "/catalog" : null},
          {label: city?.name_ru ?? "", href: section?.id ? `/catalog?city=${city?.id}` : null},
          {label: section?.name_plural ?? ""}
        ]}/>
        <h1 style={{fontWeight: "400"}}>
          {/* <span>{section?.name_plural ?? "Все спортивные объекты"} {searchParams?.city && city ? ` в ${city?.name_preposition}` : null}</span> */}
          <span>{section?.name_plural ?? "Все спортивные объекты"} {searchParams?.city && city ? ` в ${city?.name_ru}` : null}</span>
          <sup style={{fontSize: "0.5em"}}>{results?.length}</sup>
        </h1>
      </Card.Heading>
      <Card.Section style={{display: "flex", justifyContent: "space-between"}}>
        <p>Сортировка: По дате добавления</p>
        <Link href={manageSearchParams(searchParams?.map ? "delete" : "set", "map", "true")} style={{display: "flex", alignItems: "center", gap: "5px"}}>
        <img src="/icons/map-pin.svg" width={15} height={20} alt="Map Pin"/>
          <span>Карта</span>
        </Link>
      </Card.Section>
      {results.map((object) => (
        <Card.Section key={object.id} style={{display: "grid", gap: "15px", gridTemplateColumns: "1fr 1.5fr"}}>
          <img src={object.photos?.length ? `/photos/${object.photos[0].name}` : "/photos/no-photo.svg"} width="250" height="210" alt="Image" loading="lazy" style={{maxInlineSize: "100%", height: "auto", aspectRatio: "250/210"}}/>
          <div>
            <Link href={`object/${object.id}`}>{object.name} {object.name_where}</Link>
            <p>{object.city?.name_ru}, {object.address}</p>
            <hr/>
            <ul style={{display: "flex", gap: "10px", flexWrap: "wrap", listStyle: "none", paddingInlineStart: 0}}>
              {object.options?.map(({option}) => {
                return (
                  <li key={option?.id}>{option?.name}</li>
                )
              })}
            </ul>
          </div>
        </Card.Section>
      ))}
    </Card>
  )
}