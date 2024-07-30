import { ObjectEdit } from "@/app/_components/pages/ObjectEdit";
import { Breadcrumbs } from "@/app/_components/ui/Breadcrumbs";
// -----------------------------------------------------------------------------
import { getObjectWithPayloadById } from "@/app/_db/object"
import { objectTypeEnum } from "@/drizzle/schema";


export default async function ObjectEditPage({params}:{params: {id:string, type:string}}) {
  const object = await getObjectWithPayloadById(Number(params.id));

  return (
    <div className="container page">
      <Breadcrumbs items={[
        { label: "Каталог", href: "/catalog" },
        { label: object.name_type?.concat(object.name_title ? ` «${object.name_title}»` : "").concat(object.name_where ? ` ${object.name_where}` : "") ?? "", href: `/object/${object.object_id}` },
        { label: `Редактировать ${object.type === objectTypeEnum.org ? "организацию" : "место"}` },
      ]}/>
      <ObjectEdit init={object}/>
    </div>
  )
}