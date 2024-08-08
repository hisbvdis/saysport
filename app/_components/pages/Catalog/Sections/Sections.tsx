import Link from "next/link";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { CatalogContext } from "../Catalog";
import { Card } from "@/app/_components/ui/Card";
// -----------------------------------------------------------------------------
import { useManageSearchParams } from "@/app/_utils/useManageSearchParams";
import { sectionTypeEnum } from "@/drizzle/schema";


export default function Sections(props:Props) {
  const { style, className } = props;
  const { sectionList } = useContext(CatalogContext);
  const manageSearchParams = useManageSearchParams();

  return (
    <Card className={className} style={style}>
      <Card.Heading>Разделы</Card.Heading>
      <Card.Section>
        <ul>
          {sectionList.filter((section) => section.section_type === sectionTypeEnum.section).map((section) => (
            <li key={section.section_id}>
              <Link href={manageSearchParams.set("section", String(section.section_id))}>{section.name_public_plural}</Link>
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