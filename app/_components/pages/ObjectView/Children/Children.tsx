import Link from "next/link";
import { useContext } from "react"
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
// -----------------------------------------------------------------------------
import { ObjectViewContext } from "../ObjectView"


export default function Children() {
  const { state } = useContext(ObjectViewContext);
  if (state.type !== "org") return null;

  return (
    <Card>
      <Card.Heading style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
        <span>На базе организации</span>
        <Link href={`/object/add/place?parent=${state.object_id}`}>Добавить</Link>
      </Card.Heading>
      <Card.Section>
        <ul style={{display: "grid", gap: "15px", gridTemplateColumns: "repeat(3, 1fr)"}}>
          {state.children?.map((child) => (
            <li key={child.object_id}>
              <Link href={`/object/${child.object_id}`} style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "5px"}}>
                <img src={child.photos?.length ? `/photos/${child.photos[0].name}` : "/no-photo.svg"} width="178" height="120" style={{width: "178px", height: "120px", objectFit: "cover"}} alt="" loading="lazy"/>
                <span style={{textAlign: "center"}}>{child.name_type}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Card.Section>
    </Card>
  )
}