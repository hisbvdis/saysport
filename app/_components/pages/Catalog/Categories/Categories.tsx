import Link from "next/link";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { CatalogContext } from "../Catalog";
import { Card } from "@/app/_components/ui/Card";
// -----------------------------------------------------------------------------
import { useManageSearchParams } from "@/app/_utils/useManageSearchParams";


export default function Categories(props:Props) {
  const { style, className } = props;
  const { categories } = useContext(CatalogContext);
  const manageSearchParams = useManageSearchParams();

  return (
    <Card className={className} style={style}>
      <Card.Heading>Категории</Card.Heading>
      <Card.Section>
        <ul>
          {categories.map((category) => (
            <li key={category.category_id}>
              <Link href={manageSearchParams.set("section", String(category.category_id))}>{category.name}</Link>
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