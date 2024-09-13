import { Breadcrumbs } from "@/app/_components/ui/Breadcrumbs";
import { SectionEdit } from "@/app/_components/pages/SectionEdit";
// -----------------------------------------------------------------------------
import { getEmptySection, getSectionById } from "@/app/_db/section"
import { getCategoryById, getEmptyCategory } from "@/app/_db/category";
import CategoryEdit from "@/app/_components/pages/CategoryEdit/CategoryEdit";
import type { ProcessedCategory } from "@/app/_types/types";


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