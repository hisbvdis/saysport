import { useContext } from "react"
import { ObjectViewContext } from "../ObjectView"
import { Card } from "@/app/_components/ui/Card";
import Link from "next/link";
import Image from "next/image";

export default function Children() {
  const { state } = useContext(ObjectViewContext);
  if (state.type !== "org") return null;

  return (
    <Card>
      <Card.Heading style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
        <span>На базе организации</span>
        <Link href={`/object/add/place?parent=${state.id}`}>Добавить</Link>
      </Card.Heading>
      <Card.Section>
        <ul>
          {state.children?.map((child) => (
            <li key={child.id}>
              <Link href={`/object/${child.id}`}>
                <Image src={child.photos?.length ? `/photos/${child.photos[0].name}` : "/no-photo.svg"} width="178" height="120" alt="Image" loading="lazy"/>
                <span>{child.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Card.Section>
    </Card>
  )
}