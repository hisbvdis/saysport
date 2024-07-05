import { ObjectEdit } from "@/app/_components/pages/ObjectEdit";
import { Breadcrumbs } from "@/app/_components/ui/Breadcrumbs";
// -----------------------------------------------------------------------------
import { getObjectWithPayloadById } from "@/app/_db/object"


export default async function ObjectEditPage({params}:{params: {id:string, type:string}}) {
  const object = await getObjectWithPayloadById(Number(params.id));

  return (
    <div className="container page">
      <Breadcrumbs items={[
        { label: "Каталог", href: "/catalog" },
        { label: `${object.name} ${object.name_where ?? ""}`, href: `/object/${object.object_id}` },
        { label: `Edit ${params.type === "org" ? "org" : "place"}` },
      ]}/>
      <ObjectEdit init={object}/>
    </div>
  )
}