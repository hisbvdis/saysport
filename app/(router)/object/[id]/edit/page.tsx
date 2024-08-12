import { ObjectEdit } from "@/app/_components/pages/ObjectEdit";
import { Breadcrumbs } from "@/app/_components/ui/Breadcrumbs";
// -----------------------------------------------------------------------------
import { getObjectById } from "@/app/_db/object"
import { auth } from "@/auth";
import { objectTypeEnum } from "@/drizzle/schema";
import { redirect } from "next/navigation";


export default async function ObjectEditPage({params}:{params: {id:string, type:string}}) {
  const session = await auth();
  if (!session) redirect("/")
  const object = await getObjectById(Number(params.id));

  return (
    <div className="container page">
      <Breadcrumbs items={[
        { label: "Каталог", href: "/catalog" },
        { label: object.name_type?.concat(object.name_title ? ` «${object.name_title}»` : "").concat(object.name_where ? ` ${object.name_where}` : "") ?? "", href: `/object/${object.object_id}` },
        { label: `Редактировать ${object.type === objectTypeEnum.org ? "организацию" : object.type === objectTypeEnum.place  ? "место" : "секцию"}` },
      ]}/>
      <ObjectEdit init={object}/>
    </div>
  )
}