"use client";
import Link from "next/link";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
import { ObjectViewContext } from "../ObjectView";


export default function Usages() {
  const { state } = useContext(ObjectViewContext);

  return (<>
    {state.usages?.map((usage) => {
      const section = state.sections.find((section) => section.section_id === usage.section_id);
      if (!section) return;
      return (
        <Card key={usage.usage_id}>
          <Card.Heading>{section.name_singular}</Card.Heading>
          <Card.Section>
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
          {usage.description ? (
            <Card.Section>
              <p>{usage.description}</p>
            </Card.Section>
          ) : null}
        </Card>
      )
    })}
  </>)
}