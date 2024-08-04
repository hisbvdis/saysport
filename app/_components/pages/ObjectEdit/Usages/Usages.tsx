"use client";
import React, { useContext } from "react";
import { sectionTypeEnum } from "@/drizzle/schema";
// -----------------------------------------------------------------------------
import { SectionItem } from "../";
import { Card } from "@/app/_components/ui/Card";
import { ObjectEditContext } from "../ObjectEdit";
import { Select } from "@/app/_components/ui/Select";
import { Textarea } from "@/app/_components/ui/Input";
// -----------------------------------------------------------------------------
import { getSectionsByFilters } from "@/app/_db/section";


export default function Usages() {
  const { state, handleUsages } = useContext(ObjectEditContext);

  return (
    <Card style={{marginBlockStart: "10px"}}>
      <Card.Heading>Использование</Card.Heading>
      <Card.Section style={{display: "flex", flexDirection: "column", gap: "20px"}}>
        {state.usages?.map((usage) => (
          <React.Fragment key={usage.section_id}>
            <SectionItem section={usage.section} delFunc={handleUsages.delete}/>
            <Textarea name="description" value={usage.description} onChange={(e) => handleUsages.changeDescription(e, usage)} maxLength="2000" />
          </React.Fragment>
        ))}
      </Card.Section>
      <Card.Section>
        <Select
          isAutocomplete
          value=""
          onChangeData={handleUsages.add}
          placeholder="Добавить использование"
          requestItemsOnFirstTouch={async () =>
            (await getSectionsByFilters({objectType: state.type, sectionType: sectionTypeEnum.usage}))
              .map((section) => ({id: section.section_id, label: section.name_plural, data: section}))
          }
        />
      </Card.Section>
    </Card>
  )
}