import { useContext } from "react";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
// -----------------------------------------------------------------------------
import { CatalogContext } from "../Catalog";
import { useManageSearchParams } from "@/app/_utils/useManageSearchParams";
import Link from "next/link";
import Image from "next/image";
import { Control } from "@/app/_components/ui/Control";
import { Checkbox, CheckboxGroup } from "@/app/_components/ui/Choice";


export default function Filters(props:Props) {
  const { className, style } = props;
  const { searchParams, section } = useContext(CatalogContext);
  const manageSearchParams = useManageSearchParams();

  return (
    <Card className={className} style={style}>
      <Card.Heading style={{display: "flex", alignItems: "center"}}>
        <span style={{marginInlineEnd: "auto"}}>{section?.name_plural}</span>
        <Link href={manageSearchParams("delete", ["section", "options"])}>
          <Image src="/icons/close-icon.svg" width={15} height={20} alt="Map Pin"/>
        </Link>
      </Card.Heading>
      {section?.specs.map((spec) => (
        <Card.Section key={spec.id}>
          <Control>
            <Control.Label>{spec.name_public}</Control.Label>
            <CheckboxGroup arrayToCompareWith={searchParams.options?.split(",")}>
              {spec.options?.map((opt) => (
                <Link key={opt.id} href={manageSearchParams("append", "options", `${spec.id}:${opt.id}`)}>
                  <Checkbox value={`${spec.id}:${opt.id}`} tabIndex={-1}>{opt.name}</Checkbox>
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