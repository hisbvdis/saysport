import Link from "next/link";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { CatalogContext } from "../Catalog";
import { Card } from "@/app/_components/ui/Card";
// -----------------------------------------------------------------------------
import { useManageSearchParams } from "@/app/_utils/useManageSearchParams";


export default function Categories(props:Props) {
  const { style, className } = props;
  const { sectionList } = useContext(CatalogContext);
  const manageSearchParams = useManageSearchParams();

  return (
    <Card className={className} style={style}>
      <Card.Heading>Разделы</Card.Heading>
      <Card.Section>
        <ul>
          {sectionList.map((section) => (
            <li key={section.id}>
              <Link href={manageSearchParams("set", "section", String(section.id))}>{section.name_plural}</Link>
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