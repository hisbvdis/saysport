"use client";
import { create } from "mutative";
import { sectionTypeEnum } from "@/drizzle/schema";
import type { UISection } from "@/app/_types/types";
import React, { type ChangeEvent, useContext } from "react";
// -----------------------------------------------------------------------------
import { SectionItem } from "../";
import { Card } from "@/app/_components/ui/Card";
import { ObjectEditContext } from "../ObjectEdit";
import { Select } from "@/app/_components/ui/Select";
import { Textarea } from "@/app/_components/ui/Input";
// -----------------------------------------------------------------------------
import { getSectionsByFilters } from "@/app/_db/section";
import { RequiredInput } from "@/app/_components/ui/RequiredInput";


export default function Usages() {
  const { state, setState, handleSections } = useContext(ObjectEditContext);

  const handleDescription = (e:ChangeEvent<HTMLInputElement>, section:UISection) => {
    setState((prevState) => create(prevState, (draft) => {
      const sectionItem = draft.sections?.find((stateSection) => stateSection.section_id === section.section_id);
      if (!sectionItem) return;
      sectionItem.description = e.target.value;
    }))
  }

  return (
    <Card style={{marginBlockStart: "10px"}}>
      <Card.Heading>Использование</Card.Heading>
      <Card.Section style={{display: "flex", flexDirection: "column", gap: "20px"}}>
        {state.sections?.filter((section) => section.section_type === sectionTypeEnum.usage).map((section) => (
          <React.Fragment key={section.section_id}>
            <SectionItem section={section} delFunc={(section) => handleSections.delete(section)}/>
            <Textarea name="description" value={section.description} onChange={(e) => handleDescription(e, section)} maxLength="2000" />
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
              .map((section) => ({id: section.section_id, label: section.name_service, data: section}))
          }
        />
        <RequiredInput isValidIf={Boolean(state.sections.filter((section) => section.section_type === sectionTypeEnum.usage).length > 0)}/>
      </Card.Section>
    </Card>
  )
}