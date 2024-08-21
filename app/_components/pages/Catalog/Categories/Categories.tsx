"use client";
import Link from "next/link";
import { useContext } from "react";
import { useRouter } from "next/navigation";
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
  const { categories } = useContext(CatalogContext);
  const manageSearchParams = useManageSearchParams();
  const router = useRouter();
  const { className, style } = props;

  return (
    <Card className={className} style={style}>
      <Card.Heading>Категории</Card.Heading>
      <Card.Section style={{padding: 0}}>
        <Select
          isAutocomplete
          onChange={(e) => {
            const paramsWithoutPageParam = manageSearchParams.delete(["page"]);
            router.push(manageSearchParams.set("section", e.target.value, paramsWithoutPageParam))
          }}
          placeholder="Найти раздел"
          requestItemsOnInputChange={async (name) =>
            (await getSectionsByFilters({name_public_plural: name}))
              ?.map((section) => ({id: section.section_id, label: section.name_service, data: section}))
          }
        />
        <ul className={styles["categories__list"]}>
          {categories.filter((category) => category.sections.length).map((category) => (
            <li key={category.category_id} className={styles["categories__item"]}>
              <span>{category.name}</span>
              <section className={styles["categories__popup"]}>
                <div className={styles["categories__column"]}>
                  <h3 className={styles["categories__heading"]}>Организации</h3>
                  <ul>
                    {category.sections.filter((section) => section.object_type === objectTypeEnum.org).map((section) => (
                      <li key={section.section_id}>
                        <Link href={manageSearchParams.set("section", String(section.section_id))}>{section.name_public_plural}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={styles["categories__column"]}>
                  <h3 className={styles["categories__heading"]}>Места</h3>
                  <ul>
                  {category.sections.filter((section) => section.object_type === objectTypeEnum.place).map((section) => (
                      <li key={section.section_id}>
                        <Link href={manageSearchParams.set("section", String(section.section_id))}>{section.name_public_plural}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={styles["categories__column"]}>
                  <h3 className={styles["categories__heading"]}>Секции</h3>
                  <ul>
                  {category.sections.filter((section) => section.object_type === objectTypeEnum.class).map((section) => (
                      <li key={section.section_id}>
                        <Link href={manageSearchParams.set("section", String(section.section_id))}>{section.name_public_plural}</Link>
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