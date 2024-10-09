"use client";
import Link from "next/link";
import { use } from "react"
import { sectionTypeEnum } from "@/drizzle/schema";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
import { ObjectViewContext } from "../ObjectView";
// -----------------------------------------------------------------------------


export default function Sections() {
  const { state } = use(ObjectViewContext);

  return (
    <Card>
      <Card.Heading>Характеристики</Card.Heading>
      {state.sections?.filter((section) => section.section_type === sectionTypeEnum.section || section.section_type === sectionTypeEnum.common).map((section) => (
        <Card.Section key={section.section_id}>
          <Link href={`/?city=${state.city_id}&section=${section.section_id}`}>
            {section.name_public_singular}
          </Link>
          {section.specs.map((spec) => (
            <div key={spec.spec_id} style={{display: "flex", gap: "10px"}}>
              <p>{spec.name_public}</p>
              <ul style={{display: "flex", gap: "10px"}}>
                {state.options?.filter((option) => option.spec_id === spec.spec_id).map((option) => (
                  <li key={option.option_id}>
                    <Link href={`/?city=${state.city_id}&section=${section?.section_id}&options=${option.spec_id}:${option.option_id}`}>{option.name}</Link>
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