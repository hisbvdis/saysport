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
      <Breadcrumbs items={[{label: "Admin", href: "/admin"}, {label: "Specs"}]}/>
      <Card style={{marginBlockStart: "10px"}}>
        <Card.Section style={{flex: "100%"}}>
          <Link href="/admin/specs/add">Create</Link>
        </Card.Section>
        <Card.Section>
          <ul>
            {specs?.toSorted((a, b) => a.name_service.localeCompare(b.name_service)).map(({id, name_service}) => (
              <li key={id} style={{display: "flex", gap: "10px"}}>
                <DelBtn id={id} delFunc={deleteSpecById}/>
                <Link href={`/admin/specs/${id}`}>{name_service}</Link>
              </li>
            ))}
          </ul>
        </Card.Section>
      </Card>
    </main>
  )
}