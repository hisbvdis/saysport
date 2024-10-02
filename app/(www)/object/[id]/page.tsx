import type { Metadata } from "next";
import { ObjectView } from "@/app/_components/pages/ObjectView";
// -----------------------------------------------------------------------------
import { getObjectById } from "@/app/_actions/db/object"
// -----------------------------------------------------------------------------


export default async function ObjectViewPage({params}:Props) {
  const object = await getObjectById(Number(params.id));

  return (
    <ObjectView init={object}/>
  )
}

export async function generateMetadata({params}:Props):Promise<Metadata> {
  const object = await getObjectById(Number(params.id));
  return {
    title: `${object.name_type.concat(object.name_title ? ` ${object.name_title}` : "").concat(object.name_where ? ` ${object.name_where}` : "")} в ${object.city?.name_preposition} | SaySport.info`
  }
}
interface Props {
  params: { id: string },
}