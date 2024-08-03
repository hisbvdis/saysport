"use client";
import React, { useContext } from "react";
import { objectTypeEnum, sectionTypeEnum } from "@/drizzle/schema";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
import { ObjectEditContext } from "../ObjectEdit";
import { Select } from "@/app/_components/ui/Select";
import { RequiredInput } from "@/app/_components/ui/RequiredInput";
import { SectionItem } from "../";
// -----------------------------------------------------------------------------
import { getSectionsByFilters } from "@/app/_db/section";
import { Textarea } from "@/app/_components/ui/Input";


export default function Usages() {
  const { state, handleSections, handleStateChange } = useContext(ObjectEditContext);

  return (
    <Card style={{marginBlockStart: "10px"}}>
      <Card.Heading>Использование</Card.Heading>
      <Card.Section style={{display: "flex", flexDirection: "column", gap: "20px"}}>
        {state.sections.filter((section) => section.section_type === sectionTypeEnum.usage).map((section) => (
          <React.Fragment key={section.section_id}>
            <SectionItem section={section}/>
            <Textarea name="description" value={state.description} onChange={handleStateChange.value} maxLength="2000" />
          </React.Fragment>
        ))}

      </Card.Section>
      <Card.Section>
        <Select
          isAutocomplete
          value=""
          onChangeData={handleSections.add}
          placeholder="Добавить использование"
          requestItemsOnFirstTouch={async () =>
            (await getSectionsByFilters({objectType: state.type, sectionType: sectionTypeEnum.usage}))
              .map((section) => ({id: section.section_id, label: section.name_plural, data: section}))
          }
        />
        <RequiredInput isValidIf={state.type === objectTypeEnum.org ? Boolean(state.sections.filter((section) => section.section_type !== sectionTypeEnum.usage).length > 0) : Boolean(state.sections.filter((section) => section.section_type !== sectionTypeEnum.usage).length > 1)}/>
      </Card.Section>
    </Card>
  )
}