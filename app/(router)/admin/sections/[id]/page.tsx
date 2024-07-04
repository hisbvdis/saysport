import { Breadcrumbs } from "@/app/_components/ui/Breadcrumbs";
import { SectionEdit } from "@/app/_components/pages/SectionEdit";
// -----------------------------------------------------------------------------
import { getEmptySection, getSectionById, getSectionWithPayloadById } from "@/app/_db/section"


export default async function SectionPage({params}:{params:{id:string}}) {
  const section = (params.id === "add") ? await getEmptySection() : await getSectionWithPayloadById(Number(params.id));

  return (
    <main className="container page">
      <Breadcrumbs items={[
        { label: "Админка", href: "/admin" },
        { label: "Разделы", href: "/admin/sections" },
        { label: section?.section_id ? "Редактировать" : "Создать" },
      ]}/>
      <SectionEdit init={section}/>
    </main>
  )
}