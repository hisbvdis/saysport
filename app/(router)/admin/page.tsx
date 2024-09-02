import Link from "next/link";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
import { Breadcrumbs } from "@/app/_components/ui/Breadcrumbs";
import { auth } from "@/auth";
import { redirect } from "next/navigation";


export default async function AdminPage() {
  const session = await auth();
  if (!session) redirect("/")

  return (
    <div className="container  page">
      <Breadcrumbs items={[{label: "Админка"}]}/>
      <Card style={{marginBlockStart: "10px"}}>
        <ul>
          <li>
            <Link href="/admin/categories">Категории</Link>
          </li>
          <li>
            <Link href="/admin/sections">Разделы</Link>
          </li>
          <li>
            <Link href="/admin/specs">Характеристики</Link>
          </li>
          <li>
            <Link href="/admin/usages">Использование</Link>
          </li>
        </ul>
      </Card>
    </div>
  )
}