import type { objectTypeEnum } from "@/drizzle/schema";
// -----------------------------------------------------------------------------
import { Breadcrumbs } from "@/app/_components/ui/Breadcrumbs";
import { ObjectEdit } from "@/app/_components/pages/ObjectEdit/";
// -----------------------------------------------------------------------------
import { getEmptyObject, getObjectWithPayloadById } from "@/app/_db/object";
import { getSectionWithPayloadById } from "@/app/_db/section";


export default async function AddObjectPage({params, searchParams}:Props) {
  const emptyObject = await getEmptyObject();
  const parentObject = searchParams.parent ? await getObjectWithPayloadById(Number(searchParams.parent)) : null;
  const commonPlaceSection = await getSectionWithPayloadById(5);

  return (
    <main className="container  page">
      <Breadcrumbs items={[
        { label: "Каталог", href: "/catalog" },
        { label: `Добавить ${params.type === "org" ? "организацию" : "место"}` },
      ]}/>
      <ObjectEdit init={{...emptyObject, type: params.type as objectTypeEnum}} parent={parentObject} commonPlaceSection={commonPlaceSection}/>
    </main>
  )
}

interface Props {
  params:{ type:string };
  searchParams: { parent: string };
}