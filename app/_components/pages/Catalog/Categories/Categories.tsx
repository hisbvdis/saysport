"use client";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { objectTypeEnum } from "@/drizzle/schema";
// -----------------------------------------------------------------------------
import { CatalogContext } from "../Catalog";
import { Card } from "@/app/_components/ui/Card";
import { Select } from "@/app/_components/ui/Select";
// -----------------------------------------------------------------------------
import { getSectionsByFilters } from "@/app/_db/section";
import { useManageSearchParams } from "@/app/_utils/useManageSearchParams";
// -----------------------------------------------------------------------------
import styles from "./style.module.css";


export default function Categories(props:Props) {
  const router = useRouter();
  const { className } = props;
  const { categories } = useContext(CatalogContext);
  const manageSearchParams = useManageSearchParams();
  const [isOpenedCategory, setIsOpenedCategory] = useState<number|null>(null);

  return (
    <Card className={clsx(styles["categories"], className)}>
      <Card.Heading className={styles["categories__heading"]}>Категории</Card.Heading>
      <Card.Section style={{padding: 0}}>
        <Select
          className={styles["catetories__select"]}
          isAutocomplete
          onChange={(data) => {
            const paramsWithoutPageParam = manageSearchParams.delete(["page"]);
            router.push(manageSearchParams.set("section", data.value, paramsWithoutPageParam))
          }}
          placeholder="Найти раздел..."
          requestItemsOnInputChange={async (name) =>
            (await getSectionsByFilters({name_public_plural: name}))
              ?.map((section) => ({id: section.section_id, label: section.name_service, data: section}))
          }
        />
        <ul className={styles["categories__list"]}>
          {categories.filter((category) => category.sections.length).map((category, i) => (
            <li key={category.category_id} className={clsx(styles["categories__item"], i === isOpenedCategory && styles["categories__item--isOpened"])}>
              <button className={styles["categories__itemButton"]} type="button" onClick={() => setIsOpenedCategory(i === isOpenedCategory ? null : i)}>{category.name}</button>
              <section className={styles["categories__popup"]}>
                <div className={styles["categories__popupColumn"]}>
                  <h3 className={styles["categories__popupHeading"]}>Организации</h3>
                  <ul>
                    {category.sections.filter((section) => section.object_type === objectTypeEnum.org).toSorted((a, b) => a.name_public_plural.localeCompare(b.name_public_plural)).map((section) => (
                      <li key={section.section_id}>
                        <Link className={styles["categories__link"]} href={manageSearchParams.set("section", String(section.section_id))} tabIndex={i === isOpenedCategory ? 0 : -1}>{section.name_public_plural}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={styles["categories__popupColumn"]}>
                  <h3 className={styles["categories__popupHeading"]}>Места</h3>
                  <ul>
                  {category.sections.filter((section) => section.object_type === objectTypeEnum.place).toSorted((a, b) => a.name_public_plural.localeCompare(b.name_public_plural)).map((section) => (
                      <li key={section.section_id}>
                        <Link className={styles["categories__link"]} href={manageSearchParams.set("section", String(section.section_id))} tabIndex={i === isOpenedCategory ? 0 : -1}>{section.name_public_plural}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={styles["categories__popupColumn"]}>
                  <h3 className={styles["categories__popupHeading"]}>Секции</h3>
                  <ul>
                  {category.sections.filter((section) => section.object_type === objectTypeEnum.class).toSorted((a, b) => a.name_public_plural.localeCompare(b.name_public_plural)).map((section) => (
                      <li key={section.section_id}>
                        <Link className={styles["categories__link"]} href={manageSearchParams.set("section", String(section.section_id))} tabIndex={i === isOpenedCategory ? 0 : -1}>{section.name_public_plural}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </li>
          ))}
        </ul>
      </Card.Section>
    </Card>
  )
}

interface Props {
  style?: React.CSSProperties;
  className?: string;
}