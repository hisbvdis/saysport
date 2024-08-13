import { auth } from "@/auth";
import { ObjectView } from "@/app/_components/pages/ObjectView";
// -----------------------------------------------------------------------------
import { getObjectById } from "@/app/_db/object"
// -----------------------------------------------------------------------------


export default async function ObjectViewPage({params}:Props) {
  const object = await getObjectById(Number(params.id));
  const session = await auth();

  return (
    <ObjectView init={object} session={session}/>
  )
}

interface Props {
  params: { id: string },
}