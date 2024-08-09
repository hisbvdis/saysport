import { objectTypeEnum, sectionTypeEnum } from "@/drizzle/schema";
// -----------------------------------------------------------------------------
import { Breadcrumbs } from "@/app/_components/ui/Breadcrumbs";
import { ObjectEdit } from "@/app/_components/pages/ObjectEdit/";
// -----------------------------------------------------------------------------
import { getEmptyObject, getObjectById } from "@/app/_db/object";
import { getSectionsByFilters } from "@/app/_db/section";


export default async function AddObjectPage({params, searchParams}:Props) {
  const emptyObject = await getEmptyObject();
  const parentObject = searchParams.parent ? await getObjectById(Number(searchParams.parent)) : null;
  const commonSections = params.type === objectTypeEnum.place ? await getSectionsByFilters({objectType: objectTypeEnum.place, sectionType: sectionTypeEnum.common}) : await getSectionsByFilters({objectType: objectTypeEnum.class, sectionType: sectionTypeEnum.common});

  return (
    <main className="container  page">
      <Breadcrumbs items={[
        { label: "Каталог", href: "/catalog" },
        { label: `Добавить ${params.type === objectTypeEnum.org ? "организацию" : params.type === objectTypeEnum.place  ? "место" : "секцию"}` },
      ]}/>
      <ObjectEdit init={{...emptyObject, type: params.type as objectTypeEnum}} parent={parentObject} commonSections={commonSections}/>
    </main>
  )
}

interface Props {
  params:{ type:string };
  searchParams: { parent: string };
}