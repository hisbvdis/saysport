import { ObjectEdit } from "@/app/_components/pages/ObjectEdit";
import { Breadcrumbs } from "@/app/_components/ui/Breadcrumbs";
// -----------------------------------------------------------------------------
import { getObjectById } from "@/app/_db/object"


export default async function ObjectEditPage({params}:{params: {id:string, type:string}}) {
  const object = await getObjectById(Number(params.id));

  return (
    <div className="container page">
      <Breadcrumbs items={[
        { label: "Catalog", href: "/catalog" },
        { label: `${object.name}`, href: `/object/${object.id}` },
        { label: `Edit ${params.type === "org" ? "org" : "place"}` },
      ]}/>
      <ObjectEdit init={object}/>
    </div>
  )
}