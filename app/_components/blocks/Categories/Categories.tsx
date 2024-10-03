"use client";
import cx from "classix";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { objectTypeEnum } from "@/drizzle/schema";
import type { ProcessedDBCategory } from "@/app/_types/db";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
import { Select } from "@/app/_components/primitives/Select";
// -----------------------------------------------------------------------------
import { getSectionsByFilters } from "@/app/_actions/db/section";
import { useManageSearchParams } from "@/app/_hooks/useManageSearchParams";
// -----------------------------------------------------------------------------
import styles from "./style.module.css";


export default function Categories(props:Props) {
  const router = useRouter();
  const { className, categories } = props;
  const manageSearchParams = useManageSearchParams();
  const [isOpenedCategory, setIsOpenedCategory] = useState<number|null>(null);

  return (
    <Card className={cx(styles["categories"], className)}>
      <Card.Heading className={styles["categories__heading"]}>Категории</Card.Heading>
      <Card.Section style={{padding: 0}}>
        <Select
          className={styles["catetories__select"]}
          isAutocomplete
          onChange={(data) => {
            const paramsWithoutPageParam = manageSearchParams.delete(["page"]);
            router.push(`/catalog/${manageSearchParams.set("section", data.value, paramsWithoutPageParam)}`)
          }}
          placeholder="Найти раздел..."
          requestItemsOnInputChange={async (name) =>
            (await getSectionsByFilters({name_public_plural: name}))
              ?.map((section) => ({id: String(section.section_id), label: section.name_service, data: section}))
          }
        />
        <ul className={styles["categories__list"]}>
          <li className={cx(styles["categories__item"])}>
            <Link className={styles["categories__itemButton"]} href={`/catalog/${manageSearchParams.set("section", "all")}`}>Все объекты</Link>
          </li>
          {categories.filter((category) => category.sections.length).map((category, i) => (
            <li key={category.category_id} className={cx(styles["categories__item"], i === isOpenedCategory && styles["categories__item--isOpened"])}>
              <button className={styles["categories__itemButton"]} type="button" onClick={() => setIsOpenedCategory(i === isOpenedCategory ? null : i)}>{category.name}</button>
              <section className={styles["categories__popup"]}>
                <div className={styles["categories__popupColumn"]}>
                  <h3 className={styles["categories__popupHeading"]}>Организации</h3>
                  <ul>
                    {category.sections.filter((section) => section.object_type === objectTypeEnum.org).toSorted((a, b) => a.name_public_plural.localeCompare(b.name_public_plural)).map((section) => (
                      <li key={section.section_id}>
                        <Link className={styles["categories__link"]} href={`catalog/${manageSearchParams.set("section", String(section.section_id))}`} tabIndex={i === isOpenedCategory ? 0 : -1}>{section.name_public_plural}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={styles["categories__popupColumn"]}>
                  <h3 className={styles["categories__popupHeading"]}>Места</h3>
                  <ul>
                  {category.sections.filter((section) => section.object_type === objectTypeEnum.place).toSorted((a, b) => a.name_public_plural.localeCompare(b.name_public_plural)).map((section) => (
                      <li key={section.section_id}>
                        <Link className={styles["categories__link"]} href={`catalog/${manageSearchParams.set("section", String(section.section_id))}`} tabIndex={i === isOpenedCategory ? 0 : -1}>{section.name_public_plural}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={styles["categories__popupColumn"]}>
                  <h3 className={styles["categories__popupHeading"]}>Секции</h3>
                  <ul>
                  {category.sections.filter((section) => section.object_type === objectTypeEnum.class).toSorted((a, b) => a.name_public_plural.localeCompare(b.name_public_plural)).map((section) => (
                      <li key={section.section_id}>
                        <Link className={styles["categories__link"]} href={`catalog/${manageSearchParams.set("section", String(section.section_id))}`} tabIndex={i === isOpenedCategory ? 0 : -1}>{section.name_public_plural}</Link>
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
  categories: ProcessedDBCategory[];
}