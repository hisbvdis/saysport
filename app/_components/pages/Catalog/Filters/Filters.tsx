"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ProcSpec } from "@/app/_types/types";
import { type ChangeEvent, useContext, useState } from "react";
import { objectStatusEnum, objectTypeEnum, sectionTypeEnum } from "@/drizzle/schema";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
import { SelectOld } from "@/app/_components/ui/SelectOld";
import { Control } from "@/app/_components/ui/Control";
import { Checkbox, CheckboxGroup } from "@/app/_components/ui/Choice";
// -----------------------------------------------------------------------------
import { CatalogContext } from "../Catalog";
import { useManageSearchParams } from "@/app/_hooks/useManageSearchParams";
import { Cross1Icon, Cross2Icon } from "@radix-ui/react-icons";
import { Select } from "@/app/_components/ui/Select";


export default function Filters() {
  const router = useRouter();
  const manageSearchParams = useManageSearchParams();
  const [ andSpecs, setAndSpecs ] = useState<number[]>([]);
  const { searchParams, section, commonSections } = useContext(CatalogContext);

  const handleAndSpecChange = (e:ChangeEvent<HTMLInputElement>, spec:ProcSpec) => {
    if (e.target.checked) {
      setAndSpecs(andSpecs.concat(spec.spec_id))
      router.push(manageSearchParams.set("options", searchParams.options?.split(",").map((v) => v.startsWith(`${spec.spec_id}:`) ? `!${v}` : v).join(",") ?? ""))
    } else {
      setAndSpecs(andSpecs.filter((v) => v !== spec.spec_id));
      router.push(manageSearchParams.set("options", searchParams.options?.split(",").map((v) => v.startsWith(`!${spec.spec_id}:`) ? v.slice(1) : v).join(",") ?? ""))
    }
  }

  return (<>
    <Card>
      <Card.Heading style={{display: "flex", alignItems: "center"}}>
        <span style={{marginInlineEnd: "auto", paddingInlineEnd: "20px"}}>{section ? section?.name_seo_title : "Все объекты"}</span>
        {Object.keys(searchParams).filter((paramName) => !["section", "city", "map", "page"].includes(paramName) ).length
          ? <Link href={manageSearchParams.delete(Object.keys(searchParams).filter((paramName) => !["section", "city", "map", "page"].includes(paramName)))} style={{display: "flex", alignItems: "center"}} scroll={false}>
              <img src="/icons/bin.svg" width={24} height={24} alt="Map Pin" style={{inlineSize: "19px", blockSize: "19px"}}/>
            </Link>
          : null
        }
        <a href={`${manageSearchParams.delete(Object.keys(searchParams).filter((paramName) => !["city"].includes(paramName)))}`}>
          <Cross1Icon/>
        </a>
      </Card.Heading>
      {section?.specs
        .concat(section.object_type !== objectTypeEnum.org ? commonSections.filter((section) => section.section_type === sectionTypeEnum.common && section.object_type !== objectTypeEnum.org).flatMap((section) => section.specs) : [])
        .toSorted((a, b) => a.order - b.order).map((spec) => (
          <Card.Section key={spec.spec_id}>
            <Control>
              <Control.Label style={{display: "flex", justifyContent: "space-between"}}>
                <span>{spec.name_public}</span>
                {spec.is_and_in_search && <Checkbox value={String(spec.spec_id)} arrayToCompareWith={andSpecs} onChange={(e) => handleAndSpecChange(e, spec)}>И</Checkbox>}
              </Control.Label>
              <CheckboxGroup arrayToCompareWith={searchParams.options?.split(",")}>
                {spec.options?.toSorted((a, b) => a.name > b.name ? 1 : -1).map((opt) => (
                  <Link key={opt.option_id} href={manageSearchParams.appendOrClear("options", `${andSpecs.includes(spec.spec_id) ? "!" : ""}${spec.spec_id}:${opt.option_id}`)} scroll={false}>
                    <Checkbox value={`${andSpecs.includes(spec.spec_id) ? "!" : ""}${spec.spec_id}:${opt.option_id}`} tabIndex={-1} >{opt.name}</Checkbox>
                  </Link>
                ))}
              </CheckboxGroup>
            </Control>
          </Card.Section>
      ))}

      {section
        ? <Card.Section>
            <Control>
              <Control.Label style={{display: "flex", justifyContent: "space-between"}}>
                <span>Тип {section?.object_type === objectTypeEnum.place ? "использования" : "занятий"}</span>
              </Control.Label>
              <CheckboxGroup arrayToCompareWith={searchParams.usages?.split(",")}>
                {section?.usages.map((usage) => (
                  <Link key={usage.usage_id} href={manageSearchParams.appendOrClear("usages", String(usage.usage_id))} scroll={false}>
                    <Checkbox value={String(usage.usage_id)} tabIndex={-1}>{usage.name_public}</Checkbox>
                  </Link>
                ))}
              </CheckboxGroup>
            </Control>
          </Card.Section>
        : null
      }

      {section
        ? <Card.Section>
            <Control>
              <Control.Label style={{display: "flex", justifyContent: "space-between"}}>
                <span>Стоимость</span>
              </Control.Label>
              <CheckboxGroup arrayToCompareWith={searchParams.cost?.split(",")}>
                <Link href={manageSearchParams.appendOrClear("cost", "paid")} scroll={false}>
                  <Checkbox value="paid" tabIndex={-1}>Платно</Checkbox>
                </Link>
                <Link href={manageSearchParams.appendOrClear("cost", "free")} scroll={false}>
                  <Checkbox value="free" tabIndex={-1}>Бесплатно</Checkbox>
                </Link>
              </CheckboxGroup>
            </Control>
          </Card.Section>
        : null
      }

      {section?.object_type === objectTypeEnum.class ? (<>
        <Card.Section>
          <Control>
            <Control.Label style={{display: "flex", justifyContent: "space-between"}}>
              <span>Пол</span>
            </Control.Label>
            <CheckboxGroup arrayToCompareWith={searchParams.sex?.split(",")}>
              <Link href={manageSearchParams.appendOrClear("sex", "male")} scroll={false}>
                <Checkbox value="male" tabIndex={-1}>Мужской</Checkbox>
              </Link>
              <Link href={manageSearchParams.appendOrClear("sex", "female")} scroll={false}>
                <Checkbox value="female" tabIndex={-1}>Женский</Checkbox>
              </Link>
            </CheckboxGroup>
          </Control>
        </Card.Section>
        <Card.Section>
          <Control>
            <Control.Label style={{display: "flex", justifyContent: "space-between"}}>
              <span>Возраст</span>
            </Control.Label>
            <Select
              isAutocomplete
              value={searchParams.age ?? ""}
              onChange={(data) => {data.value ? router.push(manageSearchParams.set("age", data.value)) : router.push(manageSearchParams.delete(["age"]))}}
              items={[{id: "", label: ""}].concat(Array(100).fill(null).map((_, i) => ({id: String(i), label: String(i)})))}
            />
          </Control>
        </Card.Section>
      </>) : null}

      {section?.object_type === objectTypeEnum.class ? (
        <Card.Section>
          <Control>
            <p style={{display: "flex", justifyContent: "space-between"}}>
              <span>Время посещения</span>
            </p>
            <CheckboxGroup arrayToCompareWith={searchParams.days?.split(",")} style={{display: "flex", flexDirection: "row"}}>
              {Array(7).fill(null).map((_, i) => (
                <Link key={i} href={manageSearchParams.appendOrClear("days", String(i))} scroll={false}>
                  <Checkbox value={String(i)} tabIndex={-1} style={{display: "flex", flexDirection: "column-reverse"}}>{["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"][i]}</Checkbox>
                </Link>
              ))}
            </CheckboxGroup>
            <div style={{display: "flex", gap: "10px", marginBlockStart: "10px"}}>
              <Select
                isAutocomplete
                value={searchParams.from ? searchParams.from : ""}
                onChange={(data) => {data.value ? router.push(manageSearchParams.set("from", data.value)) : router.push(manageSearchParams.delete(["from"]))}}
                placeholder="с"
                items={[{id: "", label: ""}].concat(Array(48).fill(null).map((_, i) => ({id: String(i * 30), label: `${Math.floor(i / 2)}:${i % 2 === 0 ? "00" : "30"}`})))}
              />
              <Select
                isAutocomplete
                value={searchParams.to ? searchParams.to : ""}
                onChange={(data) => {data.value ? router.push(manageSearchParams.set("to", data.value)) : router.push(manageSearchParams.delete(["to"]))}}
                placeholder="до"
                items={[{id: "", label: ""}].concat(Array(48).fill(null).map((_, i) => ({id: String(i * 30), label: `${Math.floor(i / 2)}:${i % 2 === 0 ? "00" : "30"}`})))}
              />
            </div>
          </Control>
        </Card.Section>
      ) : null}

      {/* Status */}
      {/* <Card.Section>
        <Control>
          <Control.Label style={{display: "flex", justifyContent: "space-between"}}>
            <span>Статус</span>
          </Control.Label>
          <CheckboxGroup arrayToCompareWith={searchParams.status?.split(",")}>
            <Link href={manageSearchParams.appendOrClear("status", objectStatusEnum.works)} scroll={false}>
              <Checkbox value={objectStatusEnum.works} tabIndex={-1}>Работает</Checkbox>
            </Link>
            <Link href={manageSearchParams.appendOrClear("status", objectStatusEnum.open_soon)} scroll={false}>
              <Checkbox value={objectStatusEnum.open_soon} tabIndex={-1}>Скоро открытие</Checkbox>
            </Link>
            <Link href={manageSearchParams.appendOrClear("status", objectStatusEnum.might_closed)} scroll={false}>
              <Checkbox value={objectStatusEnum.might_closed} tabIndex={-1}>Возможно, не работает</Checkbox>
            </Link>
            <Link href={manageSearchParams.appendOrClear("status", objectStatusEnum.closed_temp)} scroll={false}>
              <Checkbox value={objectStatusEnum.closed_temp} tabIndex={-1}>Временно не работает</Checkbox>
            </Link>
            <Link href={manageSearchParams.appendOrClear("status", objectStatusEnum.closed_forever)} scroll={false}>
              <Checkbox value={objectStatusEnum.closed_forever} tabIndex={-1}>Закрыто навсегда</Checkbox>
            </Link>
          </CheckboxGroup>
        </Control>
      </Card.Section> */}

      {/* Photo */}
      {/* <Card.Section>
        <Control>
          <Control.Label style={{display: "flex", justifyContent: "space-between"}}>
            <span>Фото</span>
          </Control.Label>
          <CheckboxGroup arrayToCompareWith={searchParams.photo?.split(",")}>
            <Link href={manageSearchParams.appendOrClear("photo", "true")} scroll={false}>
              <Checkbox value="true" tabIndex={-1}>С фото</Checkbox>
            </Link>
            <Link href={manageSearchParams.appendOrClear("photo", "false")} scroll={false}>
              <Checkbox value="false" tabIndex={-1}>Без фото</Checkbox>
            </Link>
          </CheckboxGroup>
        </Control>
      </Card.Section> */}
    </Card>
  </>)
}

interface Props {
  style?: React.CSSProperties;
  className?: string;
}