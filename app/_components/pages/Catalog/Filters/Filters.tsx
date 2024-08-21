"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { UISpec } from "@/app/_types/types";
import { type ChangeEvent, useContext, useState } from "react";
import { objectStatusEnum, objectTypeEnum, sectionTypeEnum } from "@/drizzle/schema";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
import { Control } from "@/app/_components/ui/Control";
import { Checkbox, CheckboxGroup } from "@/app/_components/ui/Choice";
// -----------------------------------------------------------------------------
import { CatalogContext } from "../Catalog";
import { useManageSearchParams } from "@/app/_utils/useManageSearchParams";
import { Select } from "@/app/_components/ui/Select";


export default function Filters(props:Props) {
  const { className, style } = props;
  const router = useRouter();
  const manageSearchParams = useManageSearchParams();
  const [ andSpecs, setAndSpecs ] = useState<number[]>([]);
  const { searchParams, section, commonSections } = useContext(CatalogContext);

  const handleAndSpecChange = (e:ChangeEvent<HTMLInputElement>, spec:UISpec) => {
    if (e.target.checked) {
      setAndSpecs(andSpecs.concat(spec.spec_id))
      router.push(manageSearchParams.set("options", searchParams.options?.split(",").map((v) => v.startsWith(`${spec.spec_id}:`) ? `!${v}` : v).join(",") ?? ""))
    } else {
      setAndSpecs(andSpecs.filter((v) => v !== spec.spec_id));
      router.push(manageSearchParams.set("options", searchParams.options?.split(",").map((v) => v.startsWith(`!${spec.spec_id}:`) ? v.slice(1) : v).join(",") ?? ""))
    }
  }

  return (<>
    <Card className={className} style={style}>
      <Card.Heading style={{display: "flex", alignItems: "center"}}>
        <span style={{marginInlineEnd: "auto", paddingInlineEnd: "20px"}}>{section?.name_public_plural}</span>
        {Object.keys(searchParams).filter((paramName) => paramName !== "section" && paramName !== "city" && paramName !== "map" ).length
          ? <Link href={manageSearchParams.delete(Object.keys(searchParams).filter((paramName) => paramName !== "section" && paramName !== "city" && paramName !== "map" ))} style={{display: "flex", alignItems: "center"}}>
              <img src="/icons/bin.svg" width={24} height={24} alt="Map Pin" style={{inlineSize: "19px", blockSize: "19px"}}/>
            </Link>
          : null
        }
        <a href={manageSearchParams.delete(["section", "options"])}>
          <img src="/icons/close.svg" width={15} height={20} alt="Close Icon"/>
        </a>
      </Card.Heading>
      {section?.specs
        .concat(section.object_type !== objectTypeEnum.org ? commonSections.filter((section) => section.section_type === sectionTypeEnum.common && section.object_type !== objectTypeEnum.org).flatMap((section) => section.specs) : [])
        .toSorted((a, b) => a.order - b.order).map((spec) => (
          <Card.Section key={spec.spec_id}>
            <Control>
              <Control.Label style={{display: "flex", justifyContent: "space-between"}}>
                <span>{spec.name_public}</span>
                {spec.is_and_in_search && <Checkbox value={spec.spec_id} arrayToCompareWith={andSpecs} onChange={(e) => handleAndSpecChange(e, spec)}>И</Checkbox>}
              </Control.Label>
              <CheckboxGroup arrayToCompareWith={searchParams.options?.split(",")}>
                {spec.options?.toSorted((a, b) => a.order - b.order).map((opt) => (
                  <Link key={opt.option_id} href={manageSearchParams.appendOrClear("options", `${andSpecs.includes(spec.spec_id) ? "!" : ""}${spec.spec_id}:${opt.option_id}`)}>
                    <Checkbox value={`${andSpecs.includes(spec.spec_id) ? "!" : ""}${spec.spec_id}:${opt.option_id}`} tabIndex={-1}>{opt.name}</Checkbox>
                  </Link>
                ))}
              </CheckboxGroup>
            </Control>
          </Card.Section>
      ))}

      {/* Status */}
      <Card.Section>
        <Control>
          <Control.Label style={{display: "flex", justifyContent: "space-between"}}>
            <span>Статус</span>
          </Control.Label>
          <CheckboxGroup arrayToCompareWith={searchParams.status?.split(",")}>
            <Link href={manageSearchParams.appendOrClear("status", objectStatusEnum.works)}>
              <Checkbox value={objectStatusEnum.works} tabIndex={-1}>Работает</Checkbox>
            </Link>
            <Link href={manageSearchParams.appendOrClear("status", objectStatusEnum.open_soon)}>
              <Checkbox value={objectStatusEnum.open_soon} tabIndex={-1}>Скоро открытие</Checkbox>
            </Link>
            <Link href={manageSearchParams.appendOrClear("status", objectStatusEnum.might_closed)}>
              <Checkbox value={objectStatusEnum.might_closed} tabIndex={-1}>Возможно, не работает</Checkbox>
            </Link>
            <Link href={manageSearchParams.appendOrClear("status", objectStatusEnum.closed_temp)}>
              <Checkbox value={objectStatusEnum.closed_temp} tabIndex={-1}>Временно не работает</Checkbox>
            </Link>
            <Link href={manageSearchParams.appendOrClear("status", objectStatusEnum.closed_forever)}>
              <Checkbox value={objectStatusEnum.closed_forever} tabIndex={-1}>Закрыто навсегда</Checkbox>
            </Link>
          </CheckboxGroup>
        </Control>
      </Card.Section>

      {/* Photo */}
      <Card.Section>
        <Control>
          <Control.Label style={{display: "flex", justifyContent: "space-between"}}>
            <span>Фото</span>
          </Control.Label>
          <CheckboxGroup arrayToCompareWith={searchParams.photo?.split(",")}>
            <Link href={manageSearchParams.appendOrClear("photo", "true")}>
              <Checkbox value="true" tabIndex={-1}>С фото</Checkbox>
            </Link>
            <Link href={manageSearchParams.appendOrClear("photo", "false")}>
              <Checkbox value="false" tabIndex={-1}>Без фото</Checkbox>
            </Link>
          </CheckboxGroup>
        </Control>
      </Card.Section>
    </Card>

    {/* Usage */}
    <Card className={className} style={style}>
      <Card.Heading style={{display: "flex", alignItems: "center"}}>
        <span style={{marginInlineEnd: "auto", paddingInlineEnd: "20px"}}>Использование</span>
      </Card.Heading>
      <Card.Section>
        <Control>
          <Control.Label style={{display: "flex", justifyContent: "space-between"}}>
            <span>График работы</span>
          </Control.Label>
          <CheckboxGroup arrayToCompareWith={searchParams.days?.split(",")} style={{display: "flex", flexDirection: "row"}}>
            {Array(7).fill(null).map((_, i) => (
              <Link key={i} href={manageSearchParams.appendOrClear("days", String(i))}>
                <Checkbox value={String(i)} tabIndex={-1} style={{display: "flex", flexDirection: "column-reverse"}}>{["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"][i]}</Checkbox>
              </Link>
            ))}
          </CheckboxGroup>
          <div style={{display: "flex", gap: "10px", marginBlockStart: "10px"}}>
            <Select
              value={searchParams.from ? searchParams.from : ""}
              onChange={(id) => {id ? router.push(manageSearchParams.set("from", id)) : router.push(manageSearchParams.delete(["from"]))}}
              placeholder="с"
              items={[{id: "", label: ""}].concat(Array(48).fill(null).map((_, i) => ({id: String(i * 30), label: `${Math.floor(i / 2)}:${i % 2 === 0 ? "00" : "30"}`})))}
            />
            <Select
              value={searchParams.to ? searchParams.to : ""}
              onChange={(id) => {id ? router.push(manageSearchParams.set("to", id)) : router.push(manageSearchParams.delete(["to"]))}}
              placeholder="до"
              items={[{id: "", label: ""}].concat(Array(48).fill(null).map((_, i) => ({id: String(i * 30), label: `${Math.floor(i / 2)}:${i % 2 === 0 ? "00" : "30"}`})))}
            />
          </div>
        </Control>
      </Card.Section>
    </Card>
  </>)
}

interface Props {
  style?: React.CSSProperties;
  className?: string;
}