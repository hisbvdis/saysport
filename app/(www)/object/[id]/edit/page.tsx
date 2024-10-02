import { objectTypeEnum } from "@/drizzle/schema";
// -----------------------------------------------------------------------------
import { Breadcrumbs } from "@/app/_components/ui/Breadcrumbs";
import { ObjectEdit } from "@/app/_components/pages/ObjectEdit";
// -----------------------------------------------------------------------------
import { getObjectById } from "@/app/_actions/db/object"


export default async function ObjectEditPage({params}:{params: {id:string, type:string}}) {
  const object = await getObjectById(Number(params.id));

  return (
    <div className="container page">
      <Breadcrumbs items={[
        { label: "Каталог", href: "/" },
        { label: object.name_type?.concat(object.name_title ? ` «${object.name_title}»` : "").concat(object.name_where ? ` ${object.name_where}` : "") ?? "", href: `/object/${object.object_id}` },
        { label: `Редактировать ${object.type === objectTypeEnum.org ? "организацию" : object.type === objectTypeEnum.place  ? "место" : "секцию"}` },
      ]}/>
      <ObjectEdit init={object}/>
    </div>
  )
}