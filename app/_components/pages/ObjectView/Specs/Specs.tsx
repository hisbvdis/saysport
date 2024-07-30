import { useContext } from "react"
import { ObjectViewContext } from "../ObjectView"
import { Card } from "@/app/_components/ui/Card";
import Link from "next/link";

export default function Specs() {
  const { state } = useContext(ObjectViewContext);

  return (
    <Card>
      <Card.Heading>Характеристики</Card.Heading>
      {state.sections?.map((section) => (
        <Card.Section key={section.section_id}>
          <Link href={`/catalog?city=${state.city_id}&section=${section.section_id}`}>
            {section.name_singular}
          </Link>
          {section.specs.map((spec) => (
            <div key={spec.spec_id} style={{display: "flex", gap: "10px"}}>
              <p>{spec.name_public}</p>
              <ul style={{display: "flex", gap: "10px"}}>
                {state.options?.filter((option) => option.spec_id === spec.spec_id).map((option) => (
                  <li key={option.option_id}>
                    <Link href={`/catalog?city=${state.city_id}&section=${section?.section_id}&options=${option.spec_id}:${option.option_id}`}>{option.name}</Link>
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