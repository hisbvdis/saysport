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
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function Results() {
  const { searchParams, city, section, results } = useContext(CatalogContext);
  const manageSearchParams = useManageSearchParams();

  return (<>
    <Card className={styles["results"]}>
      <Card.Heading>
        <Breadcrumbs style={{fontSize: "0.85em", marginBlockEnd: "5px"}} items={[
          {label: "Каталог", href: city || section ? "/" : null},
          {label: city?.name ?? "", href: section?.section_id ? `?city=${city?.city_id}` : null},
          {label: section?.name_public_plural ?? ""}
        ]}/>
        <h1 style={{fontWeight: "400", position: "relative", display: "inline-block"}}>
          <span>{section?.name_seo_title ?? "Спортивные объекты и секции"} {searchParams?.city && city ? ` в ${city?.name_preposition}` : null}</span>
          <sup style={{fontSize: "0.5em", position: "absolute", insetInlineStart: "100%"}}>{results.totalCount}</sup>
        </h1>
        <SearchPanel/>
      </Card.Heading>
      {/* <Card.Section style={{display: "flex", justifyContent: "space-between", backgroundColor: "white"}}>
        <Link href={searchParams.map ? manageSearchParams.delete(["map"]) : manageSearchParams.set("map", "true")} style={{display: "flex", alignItems: "center", gap: "5px"}}>
          <img src="/icons/map-pin.svg" width={15} height={20} alt="Map Pin"/>
          <span>Карта</span>
        </Link>
      </Card.Section> */}
    </Card>
    <ul className={styles["results__list"]}>
      {results.requested?.map((object) => (
        <li key={object.object_id} className={styles["results__item"]}>
          <Link href={`object/${object.object_id}`}>
            <img className={styles["results__photo"]} src={object.photos?.length ? `${process.env.NEXT_PUBLIC_PHOTOS_PATH}/${object.photos[0].name}` : "/images/no-photo.svg"} width="250" height="210" alt={object.name_type.concat(object.name_title ? ` «${object.name_title}»` : "").concat(object.name_where ? ` ${object.name_where}` : "")} loading="lazy"/>
          </Link>
          <div className={styles["results__info"]}>
            {object.type === objectTypeEnum.org || (object.type === objectTypeEnum.place && !object.parent_id)
              ? <h4><Link className={styles["results__title"]} href={`object/${object.object_id}`}>{object.name_type.concat(object.name_title ? ` «${object.name_title}»` : "").concat(object.name_where ? ` ${object.name_where}` : "")}</Link></h4>
              : <>
                  <h4><Link className={styles["results__title"]} href={`object/${object.object_id}`}>{object.name_type}</Link></h4>
                  <p><Link className={styles["results__parent"]} href={`object/${object.parent_id}`}>{object.name_where}</Link></p>
                </>}
            <p className={styles["results__address"]}>{object.city?.name}, {object.address}</p>
          </div>
        </li>
      ))}
    </ul>
  </>)
}