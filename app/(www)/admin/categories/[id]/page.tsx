import { Breadcrumbs } from "@/app/_components/ui/Breadcrumbs";
import CategoryEdit from "@/app/_components/pages/CategoryEdit/CategoryEdit";
// -----------------------------------------------------------------------------
import { getCategoryById, getEmptyCategory } from "@/app/_actions/db/category";


export default async function CategoryPage({params}:{params:{id:string}}) {
  const category = (params.id === "add") ? await getEmptyCategory() : await getCategoryById(Number(params.id));

  return (
    <main className="container page">
      <Breadcrumbs items={[
        { label: "Админка", href: "/admin" },
        { label: "Категории", href: "/admin/categories" },
        { label: category.category_id ? "Редактировать" : "Создать" },
      ]}/>
      <CategoryEdit init={category}/>
    </main>
  )
}