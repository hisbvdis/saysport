import { Breadcrumbs } from "@/app/_components/ui/Breadcrumbs";
import { SectionEdit } from "@/app/_components/pages/SectionEdit";
// -----------------------------------------------------------------------------
import { getEmptySection, getSectionById } from "@/app/_db/section"


export default async function SectionPage({params}:{params:{id:string}}) {
  const section = (params.id === "add") ? await getEmptySection() : await getSectionById(Number(params.id));

  return (
    <main className="container page">
      <Breadcrumbs items={[
        { label: "Admin", href: "/admin" },
        { label: "Sections", href: "/admin/sections" },
        { label: section?.id ? "Edit" : "Create" },
      ]}/>
      <SectionEdit init={section}/>
    </main>
  )
}