import { SpecEdit } from "@/app/_components/pages/SpecEdit";
import { Breadcrumbs } from "@/app/_components/ui/Breadcrumbs";
// -----------------------------------------------------------------------------
import { getEmptySpec, getSpecById } from "@/app/_db/spec";


export default async function SpecEditPage({params}:{params: {id:string}}) {
  const spec = (params.id === "add") ? await getEmptySpec() : await getSpecById(Number(params.id));

  return (
    <main className="container page">
      <Breadcrumbs items={[
        { label: "Админка", href: "/admin" },
        { label: "Характеристики", href: "/admin/specs" },
        { label: spec?.spec_id ? "Редактировать" : "Создать" }
      ]}/>
      <SpecEdit init={spec}/>
    </main>
  )
}