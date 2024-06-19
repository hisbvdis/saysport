import { useContext } from "react"
import { ObjectViewContext } from "../ObjectView"
import { Card } from "@/app/_components/ui/Card";
import Link from "next/link";

export default function Sections() {
  const { state } = useContext(ObjectViewContext);

  return (
    <Card>
      <Card.Heading>Характеристики</Card.Heading>
      {state.sections?.map((section) => (
        <Card.Section key={section.id}>
          <Link href={`/catalog?city=${state.city_id}&section=${section.id}`}>
            {section.name_singular}
          </Link>
          {section.specs.map((spec) => (
            <div style={{display: "flex", gap: "10px"}}>
              <p>{spec.name_public}</p>
              <ul>
                {state.options?.filter((option) => option.spec_id === spec.id).map((option) => (
                  <li key={option.id}>
                    <Link href={`/catalog?city=${state.city_id}&section=${section?.id}&options=${option.spec_id}:${option.id}`}>{option.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Card.Section>
      ))}
    </Card>
  )
}