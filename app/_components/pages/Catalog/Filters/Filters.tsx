"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useContext, useState } from "react";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
import { Control } from "@/app/_components/ui/Control";
import { Checkbox, CheckboxGroup } from "@/app/_components/ui/Choice";
// -----------------------------------------------------------------------------
import { UISpec } from "@/app/_types/types";
import { CatalogContext } from "../Catalog";
import { useManageSearchParams } from "@/app/_utils/useManageSearchParams";
import { objectTypeEnum } from "@/drizzle/schema";


export default function Filters(props:Props) {
  const { className, style } = props;
  const { searchParams, section } = useContext(CatalogContext);
  const manageSearchParams = useManageSearchParams();
  const router = useRouter();
  const [ andSpecs, setAndSpecs ] = useState<number[]>([]);

  const handleAndSpecChange = (e:ChangeEvent<HTMLInputElement>, spec:UISpec) => {
    if (e.target.checked) {
      setAndSpecs(andSpecs.concat(spec.spec_id))
      router.push(manageSearchParams.set("options", searchParams.options?.split(",").map((v) => v.startsWith(`${spec.spec_id}:`) ? `!${v}` : v).join(",")!))
    } else {
      setAndSpecs(andSpecs.filter((v) => v !== spec.spec_id));
      router.push(manageSearchParams.set("options", searchParams.options?.split(",").map((v) => v.startsWith(`!${spec.spec_id}:`) ? v.slice(1) : v).join(",")!))
    }
  }

  return (
    <Card className={className} style={style}>
      <Card.Heading style={{display: "flex", alignItems: "center"}}>
        <span style={{marginInlineEnd: "auto"}}>{section?.name_plural}</span>
        {searchParams.options
          ? <Link href={manageSearchParams.delete("options")} style={{display: "flex", alignItems: "center"}}>
              <img src="/icons/bin.svg" width={24} height={24} alt="Map Pin" style={{inlineSize: "19px", blockSize: "19px"}}/>
            </Link>
          : null
        }
        <a href={manageSearchParams.delete(["section", "options"])}>
          <img src="/icons/close.svg" width={15} height={20} alt="Close Icon"/>
        </a>
      </Card.Heading>
      {section?.specs.map((spec) => (
        <Card.Section key={spec.spec_id}>
          <Control>
            <Control.Label style={{display: "flex", justifyContent: "space-between"}}>
              <span>{spec.name_public}</span>
              <Checkbox value={spec.spec_id} arrayToCompareWith={andSpecs} onChange={(e) => handleAndSpecChange(e, spec)}>И</Checkbox>
            </Control.Label>
            <CheckboxGroup arrayToCompareWith={searchParams.options?.split(",")}>
              {spec.options?.map((opt) => (
                <Link key={opt.option_id} href={manageSearchParams.appendOrClear("options", `${andSpecs.includes(spec.spec_id) ? "!" : ""}${spec.spec_id}:${opt.option_id}`)}>
                  <Checkbox value={`${andSpecs.includes(spec.spec_id) ? "!" : ""}${spec.spec_id}:${opt.option_id}`} tabIndex={-1}>{opt.name}</Checkbox>
                </Link>
              ))}
            </CheckboxGroup>
          </Control>
        </Card.Section>
      ))}
    </Card>
  )
}

interface Props {
  style?: React.CSSProperties;
  className?: string;
}