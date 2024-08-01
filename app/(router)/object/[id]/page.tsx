import { ObjectView } from "@/app/_components/pages/ObjectView";
// -----------------------------------------------------------------------------
import { getObjectById } from "@/app/_db/object"
// -----------------------------------------------------------------------------


export default async function ObjectViewPage({params}:Props) {
  const object = await getObjectById(Number(params.id));

  return (
    <ObjectView init={object}/>
  )
}

interface Props {
  params: { id: string },
}