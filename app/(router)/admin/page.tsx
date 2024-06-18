import Link from "next/link";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
import { Breadcrumbs } from "@/app/_components/ui/Breadcrumbs";


export default async function AdminPage() {
  return (
    <div className="container  page">
      <Breadcrumbs items={[{label: "Админка"}]}/>
      <Card style={{marginBlockStart: "10px"}}>
        <ul>
          <li>
            <Link href="/admin/sections">Разделы</Link>
          </li>
          <li>
            <Link href="/admin/specs">Свойства</Link>
          </li>
        </ul>
      </Card>
    </div>
  )
}