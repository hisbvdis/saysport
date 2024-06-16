import Link from "next/link";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
import { Breadcrumbs } from "@/app/_components/ui/Breadcrumbs";


export default async function AdminPage() {
  return (
    <div className="container  page">
      <Breadcrumbs items={[{label: "Admin"}]}/>
      <Card style={{marginBlockStart: "10px"}}>
        <ul>
          <li>
            <Link href="/admin/sections">Sections</Link>
          </li>
          <li>
            <Link href="/admin/specs">Specs</Link>
          </li>
        </ul>
      </Card>
    </div>
  )
}