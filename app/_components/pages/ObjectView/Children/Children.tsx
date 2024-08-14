import Link from "next/link";
import { useContext } from "react"
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
// -----------------------------------------------------------------------------
import { ObjectViewContext } from "../ObjectView"
import { objectTypeEnum } from "@/drizzle/schema";


export default function Children() {
  const { state } = useContext(ObjectViewContext);

  return (<>
    {state.children?.filter((child) => child.type === objectTypeEnum.place).length ? (
      <Card>
        <Card.Heading style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
          <span>Места</span>
        </Card.Heading>
        <Card.Section>
          <ul style={{display: "grid", gap: "15px", gridTemplateColumns: "repeat(3, 1fr)"}}>
            {state.children?.filter((child) => child.type === objectTypeEnum.place).map((child) => (
              <li key={child.object_id}>
                <Link href={`/object/${child.object_id}`} style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "5px"}}>
                  <img src={child.photos?.length ? `${process.env.NEXT_PUBLIC_PHOTOS_PATH}/${child.photos[0].name}` : `${process.env.NEXT_PUBLIC_PHOTOS_PATH}/no-photo.svg`} width="178" height="120" style={{width: "178px", height: "120px", objectFit: "cover"}} alt="" loading="lazy"/>
                  <span style={{textAlign: "center"}}>{child.name_type}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card.Section>
      </Card>
    ) : null}
    {state.children?.filter((child) => child.type === objectTypeEnum.class).length ? (
      <Card>
        <Card.Heading style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
          <span>Секции</span>
        </Card.Heading>
        <Card.Section>
          <ul style={{display: "grid", gap: "15px", gridTemplateColumns: "repeat(3, 1fr)"}}>
            {state.children?.filter((child) => child.type === objectTypeEnum.class).map((child) => (
              <li key={child.object_id}>
                <Link href={`/object/${child.object_id}`} style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "5px"}}>
                  <img src={child.photos?.length ? `${process.env.NEXT_PUBLIC_PHOTOS_PATH}/${child.photos[0].name}` : `${process.env.NEXT_PUBLIC_PHOTOS_PATH}/no-photo.svg`} width="178" height="120" style={{width: "178px", height: "120px", objectFit: "cover"}} alt="" loading="lazy"/>
                  <span style={{textAlign: "center"}}>{child.name_type}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card.Section>
      </Card>
    ) : null}
  </>)
}