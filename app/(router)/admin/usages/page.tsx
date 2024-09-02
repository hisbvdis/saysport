import Link from "next/link";
import { objectTypeEnum } from "@/drizzle/schema";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
import { DelBtn } from "@/app/_components/ui/DelBtn";
import { Breadcrumbs } from "@/app/_components/ui/Breadcrumbs";
// -----------------------------------------------------------------------------
import { deleteUsageById, getAllUsages } from "@/app/_db/usage";


export default async function UsageListPage() {
  const usages = await getAllUsages();

  return (
    <main className="container page">
      <Breadcrumbs items={[{label: "Админка", href: "/admin"}, {label: "Использование"}]}/>
      <Card style={{display: "flex", flexWrap: "wrap", marginBlockStart: "10px"}}>
        <Card.Section style={{flex: "100%"}}>
          <Link href="/admin/usages/add">Создать</Link>
        </Card.Section>
        <Card.Section style={{flex: "33%"}}>
          <h3>Организации</h3>
          <ul>
            {usages.filter((usage) => usage.object_type === objectTypeEnum.org).map((usage) => (
              <li key={usage.usage_id} style={{display: "flex", gap: "10px"}}>
                <DelBtn id={usage.usage_id} delFunc={deleteUsageById}/>
                <Link href={`/admin/usages/${usage.usage_id}`}>{usage.name_service}</Link>
              </li>
            ))}
          </ul>
        </Card.Section>
        <Card.Section style={{flex: "33%"}}>
          <h3>Места</h3>
          <ul>
            {usages.filter((usage) => usage.object_type === objectTypeEnum.place).map((usage) => (
              <li key={usage.usage_id} style={{display: "flex", gap: "10px"}}>
                <DelBtn id={usage.usage_id} delFunc={deleteUsageById}/>
                <Link href={`/admin/usages/${usage.usage_id}`}>{usage.name_service}</Link>
              </li>
            ))}
          </ul>
        </Card.Section>
        <Card.Section style={{flex: "33%"}}>
          <h3>Секции</h3>
          <ul>
            {usages.filter((usage) => usage.object_type === objectTypeEnum.class).map((usage) => (
              <li key={usage.usage_id} style={{display: "flex", gap: "10px"}}>
                <DelBtn id={usage.usage_id} delFunc={deleteUsageById}/>
                <Link href={`/admin/usages/${usage.usage_id}`}>{usage.name_service}</Link>
              </li>
            ))}
          </ul>
        </Card.Section>
      </Card>
    </main>
  )
}