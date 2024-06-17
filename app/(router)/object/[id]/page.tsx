import { getObjectById } from "@/app/_db/object"
// -----------------------------------------------------------------------------

export default async function ObjectViewPage({params}:Props) {
  const object = await getObjectById(Number(params.id));

  return (
    null
  )
}

interface Props {
  params: { id: string },
}