import Link from "next/link";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
import { DelBtn } from "@/app/_components/ui/DelBtn";
import { InputAddon } from "@/app/_components/ui/InputAddon";
import { Breadcrumbs } from "@/app/_components/ui/Breadcrumbs";
// -----------------------------------------------------------------------------
import { deleteCategoryById, getAllCategories } from "@/app/_actions/db//category";


export default async function CategoryListPage() {
  const categories = await getAllCategories();

  return (
    <main className="container page">
      <Breadcrumbs items={[{label: "Админка", href: "/admin"}, {label: "Разделы"}]}/>
      <Card style={{display: "flex", flexWrap: "wrap", marginBlockStart: "10px"}}>
        <Card.Section style={{flex: "100%"}}>
          <Link href="/admin/categories/add">Создать</Link>
        </Card.Section>
        <Card.Section style={{flex: "33%"}}>
          <ul>
            {categories?.map((category) => (
              <li key={category.category_id} style={{display: "flex", gap: "10px"}}>
                <DelBtn id={category.category_id} delFunc={deleteCategoryById}/>
                <InputAddon>{category.order}</InputAddon>
                <Link href={`/admin/categories/${category.category_id}`}>{category.name}</Link>
              </li>
            ))}
          </ul>
        </Card.Section>
      </Card>
    </main>
  )
}