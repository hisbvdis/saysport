"use client";
import React, { useContext } from "react";
import { objectTypeEnum, sectionTypeEnum } from "@/drizzle/schema";
// -----------------------------------------------------------------------------
import { SectionItem } from "../"
import { Card } from "@/app/_components/ui/Card";
import { ObjectEditContext } from "../ObjectEdit";
import { Select } from "@/app/_components/ui/Select";
import { RequiredInput } from "@/app/_components/ui/RequiredInput";
// -----------------------------------------------------------------------------
import { getSectionsByFilters } from "@/app/_db/section";


export default function Specs() {
  const { state, handleSections } = useContext(ObjectEditContext);

  return (
    <Card style={{marginBlockStart: "10px"}}>
      <Card.Heading>Характеристики</Card.Heading>
      <Card.Section style={{display: "flex", flexDirection: "column", gap: "20px"}}>
        {state.sections.filter((section) => section.section_type === sectionTypeEnum.section || section.section_type === sectionTypeEnum.common).map((section) => (
          <SectionItem key={section.section_id} section={section} delFunc={handleSections.delete}/>
        ))}
      </Card.Section>
      <Card.Section>
        <Select
          isAutocomplete
          value=""
          onChangeData={handleSections.add}
          placeholder="Добавить раздел"
          requestItemsOnFirstTouch={async () =>
            (await getSectionsByFilters({objectType: state.type, sectionType: sectionTypeEnum.section}))
              .map((section) => ({id: section.section_id, label: section.name_plural, data: section}))
          }
        />
        {/* <RequiredInput isValidIf={state.type === objectTypeEnum.org ? Boolean(state.sections.filter((section) => section.section_type !== sectionTypeEnum.usage).length > 0) : Boolean(state.sections.filter((section) => section.section_type !== sectionTypeEnum.usage).length > 1)}/> */}
      </Card.Section>
    </Card>
  )
}