import { DBObject } from "@/app/_types/types"
import Link from "next/link";

export default function Catalog(props:Props) {
  const { results } = props;

  return (
    <div className="container  page">
      <ul>
        {results.map((object) => (
          <li key={object.id}>
            <Link href={`/object/${object.id}`}>{object.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

interface Props {
  results: DBObject[];
}