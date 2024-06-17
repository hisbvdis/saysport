import { $Enums } from "@prisma/client";
// -----------------------------------------------------------------------------
import { Breadcrumbs } from "@/app/_components/ui/Breadcrumbs";
import { ObjectEdit } from "@/app/_components/pages/ObjectEdit/";
// -----------------------------------------------------------------------------
import { getEmptyObject } from "@/app/_db/object";


export default async function AddObjectPage({params}:{params:{type:string}}) {
  const emptyObject = await getEmptyObject();

  return (
    <main className="container  page">
      <Breadcrumbs items={[
        { label: "Catalog", href: "/catalog" },
        { label: `Add ${params.type === "org" ? "org" : "place"}` },
      ]}/>
      <ObjectEdit init={{...emptyObject, type: params.type as $Enums.objectTypeEnum}}/>
    </main>
  )
}