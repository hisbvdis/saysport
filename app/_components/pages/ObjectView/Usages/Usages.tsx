"use client";
import Link from "next/link";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
import { ObjectViewContext } from "../ObjectView";
import { sectionTypeEnum } from "@/drizzle/schema";


export default function Usages() {
  const { state } = useContext(ObjectViewContext);

  return (
    <Card>
      <Card.Heading>Использование</Card.Heading>
      {state.sections?.filter((section) => section.section_type === sectionTypeEnum.usage).map((section) => (
        <Card.Section key={section.section_id}>
          <p>{section.name_public_singular}</p>
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
          {section.description ? <p>{section.description}</p> : null}
        </Card.Section>
      ))}
    </Card>
  )
}