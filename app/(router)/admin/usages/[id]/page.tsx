import { UsageEdit } from "@/app/_components/pages/UsageEdit";
import { Breadcrumbs } from "@/app/_components/ui/Breadcrumbs";
// -----------------------------------------------------------------------------
import { getEmptyUsage, getUsageById } from "@/app/_db/usage";


export default async function UsageEditPage({params}:{params:{id:string}}) {
  const usage = (params.id === "add") ? await getEmptyUsage() : await getUsageById(Number(params.id));

  return (
    <main className="container page">
      <Breadcrumbs items={[
        { label: "Админка", href: "/admin" },
        { label: "Использование", href: "/admin/usages" },
        { label: usage?.usage_name_id ? "Редактировать" : "Создать" },
      ]}/>
      <UsageEdit init={usage}/>
    </main>
  )
}