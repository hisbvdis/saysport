import Link from "next/link";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
import { DelBtn } from "@/app/_components/ui/DelBtn/";
import { Breadcrumbs } from "@/app/_components/ui/Breadcrumbs";
// -----------------------------------------------------------------------------
import { deleteSpecById, getSpecsByFilters } from "@/app/_db/spec";


export default async function SpecListPage() {
  const specs = await getSpecsByFilters();

  return (
    <main className="container  page">
      <Breadcrumbs items={[{label: "Админка", href: "/admin"}, {label: "Характеристики"}]}/>
      <Card style={{marginBlockStart: "10px"}}>
        <Card.Section style={{flex: "100%"}}>
          <Link href="/admin/specs/add">Создать</Link>
        </Card.Section>
        <Card.Section>
          <ul>
            {specs?.toSorted((a, b) => a.name_service.localeCompare(b.name_service)).map((spec) => (
              <li key={spec.spec_id} style={{display: "flex", gap: "10px"}}>
                <DelBtn id={spec.spec_id} delFunc={deleteSpecById}/>
                <Link href={`/admin/specs/${spec.spec_id}`}>{spec.name_service}</Link>
              </li>
            ))}
          </ul>
        </Card.Section>
      </Card>
    </main>
  )
}