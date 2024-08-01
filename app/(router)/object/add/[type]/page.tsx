import { objectTypeEnum, sectionTypeEnum } from "@/drizzle/schema";
// -----------------------------------------------------------------------------
import { Breadcrumbs } from "@/app/_components/ui/Breadcrumbs";
import { ObjectEdit } from "@/app/_components/pages/ObjectEdit/";
// -----------------------------------------------------------------------------
import { getEmptyObject, getObjectById } from "@/app/_db/object";
import { getSectionById, getSectionsByFilters } from "@/app/_db/section";


export default async function AddObjectPage({params, searchParams}:Props) {
  const emptyObject = await getEmptyObject();
  const parentObject = searchParams.parent ? await getObjectById(Number(searchParams.parent)) : null;
  const commonPlaceSections = await getSectionsByFilters({objectType: objectTypeEnum.place, sectionType: sectionTypeEnum.common});

  return (
    <main className="container  page">
      <Breadcrumbs items={[
        { label: "Каталог", href: "/catalog" },
        { label: `Добавить ${params.type === "org" ? "организацию" : "место"}` },
      ]}/>
      <ObjectEdit init={{...emptyObject, type: params.type as objectTypeEnum}} parent={parentObject} commonPlaceSections={commonPlaceSections}/>
    </main>
  )
}

interface Props {
  params:{ type:string };
  searchParams: { parent: string };
}