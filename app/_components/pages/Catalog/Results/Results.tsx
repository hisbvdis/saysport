import Link from "next/link";
import { useContext } from "react";
import { objectTypeEnum } from "@/drizzle/schema";
// -----------------------------------------------------------------------------
import { CatalogContext } from "../Catalog";
import { Card } from "@/app/_components/ui/Card";
import { Breadcrumbs } from "@/app/_components/ui/Breadcrumbs";
import { SearchPanel } from "@/app/_components/blocks/SearchPanel";
// -----------------------------------------------------------------------------
import { useManageSearchParams } from "@/app/_utils/useManageSearchParams";
import styles from "./styles.module.css";


export default function Results() {
  const { searchParams, city, resultsLimited, section, resultsCount } = useContext(CatalogContext);
  const manageSearchParams = useManageSearchParams();

  return (
    <Card>
      <Card.Heading>
        <Breadcrumbs style={{fontSize: "0.85em", marginBlockEnd: "5px"}} items={[
          {label: "Каталог", href: city || section ? "/" : null},
          {label: city?.name ?? "", href: section?.section_id ? `?city=${city?.city_id}` : null},
          {label: section?.name_public_plural ?? ""}
        ]}/>
        <h1 style={{fontWeight: "400"}}>
          <span>{section?.name_public_plural ?? "Спортивные объекты и секции"} {searchParams?.city && city ? ` в ${city?.name_preposition}` : null}</span>
          <sup style={{fontSize: "0.5em"}}>{resultsCount}</sup>
        </h1>
        <SearchPanel/>
      </Card.Heading>
      <Card.Section style={{display: "flex", justifyContent: "space-between"}}>
        <p>Сортировка: По дате добавления</p>
        <Link href={searchParams.map ? manageSearchParams.delete(["map"]) : manageSearchParams.set("map", "true")} style={{display: "flex", alignItems: "center", gap: "5px"}}>
          <img src="/icons/map-pin.svg" width={15} height={20} alt="Map Pin"/>
          <span>Карта</span>
        </Link>
      </Card.Section>
      {resultsLimited.map((object) => (
        <Card.Section key={object.object_id} style={{display: "grid", gap: "15px", gridTemplateColumns: "1fr 1.5fr"}}>
          <img src={object.photos?.length ? `${process.env.NEXT_PUBLIC_PHOTOS_PATH}/${object.photos[0].name}` : "/no-photo.svg"} width="250" height="210" alt="" loading="lazy" style={{maxInlineSize: "100%", height: "auto", aspectRatio: "250/210", objectFit: "cover"}}/>
          <div>
            {object.type === objectTypeEnum.org || (object.type === objectTypeEnum.place && !object.parent_id) ? (
              <h4><Link className={styles["results__link"]} href={`object/${object.object_id}`}>{object.name_type.concat(object.name_title ? ` «${object.name_title}»` : "").concat(object.name_where ? ` ${object.name_where}` : "")}</Link></h4>
            ) : (
              <>
                <h4><Link className={styles["results__link"]} href={`object/${object.object_id}`}>{object.name_type}</Link></h4>
                <p><Link className={styles["results__linkParent"]} href={`object/${object.parent_id}`}>{object.name_where}</Link></p>
              </>
            )}
            <p className={styles["results__address"]}>{object.city?.name}, {object.address}</p>
            <hr/>
          </div>
        </Card.Section>
      ))}
    </Card>
  )
}