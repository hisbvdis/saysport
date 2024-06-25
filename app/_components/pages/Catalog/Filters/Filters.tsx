import Link from "next/link";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
import { Control } from "@/app/_components/ui/Control";
import { Checkbox, CheckboxGroup } from "@/app/_components/ui/Choice";
// -----------------------------------------------------------------------------
import { CatalogContext } from "../Catalog";
import { useManageSearchParams } from "@/app/_utils/useManageSearchParams";


export default function Filters(props:Props) {
  const { className, style } = props;
  const { searchParams, section } = useContext(CatalogContext);
  const manageSearchParams = useManageSearchParams();

  return (
    <Card className={className} style={style}>
      <Checkbox>И</Checkbox>
      <Card.Heading style={{display: "flex", alignItems: "center"}}>
        <span style={{marginInlineEnd: "auto"}}>{section?.name_plural}</span>
        {searchParams.options
          ? <Link href={manageSearchParams.delete("options")} style={{display: "flex", alignItems: "center"}}>
              <img src="/icons/bin.svg" width={24} height={24} alt="Map Pin" style={{inlineSize: "19px", blockSize: "19px"}}/>
            </Link>
          : null
        }
        <Link href={manageSearchParams.delete(["section", "options"])}>
          <img src="/icons/close.svg" width={15} height={20} alt="Close Icon"/>
        </Link>
      </Card.Heading>
      {section?.specs.map((spec) => (
        <Card.Section key={spec.id}>
          <Control>
            <Control.Label style={{display: "flex", justifyContent: "space-between"}}>
              <span>{spec.name_public}</span>
            </Control.Label>
            <CheckboxGroup arrayToCompareWith={searchParams.options?.split(",")}>
              {spec.options?.map((opt) => (
                <Link key={opt.id} href={manageSearchParams.appendOrClear("options", `${spec.id}:${opt.id}`)}>
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