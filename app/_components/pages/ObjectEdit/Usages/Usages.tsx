"use client";
import { create } from "mutative";
import { sectionTypeEnum } from "@/drizzle/schema";
import React, { type ChangeEvent, useContext } from "react";
import { format } from "date-fns";
// -----------------------------------------------------------------------------
import { SectionItem } from "../";
import { Card } from "@/app/_components/ui/Card";
import { ObjectEditContext } from "../ObjectEdit";
import { Select } from "@/app/_components/ui/Select";
import { Button } from "@/app/_components/ui/Button";
import { Control } from "@/app/_components/ui/Control";
import { Checkbox } from "@/app/_components/ui/Choice";
import { Input, Textarea } from "@/app/_components/ui/Input";
// -----------------------------------------------------------------------------
import { getSectionsByFilters } from "@/app/_db/section";
import type { UIObjectUsage, UIScheduleDay, UISection } from "@/app/_types/types";


export default function Usages() {
  const { state, setState, handleSections } = useContext(ObjectEditContext);

  const handleUsages = {
    add: (section:UISection) => {
      handleSections.add(section);
      if (!section.section_id || state.usages?.some((stateUsage) => stateUsage.section_id === section.section_id)) return;
      setState((prevState) => create(prevState, (draft) => {
        if (!draft.usages) draft.usages = [];
        draft.usages.push({object_id: -1, usage_id: section.section_id, section_id: section.section_id, description: ""});
      }))
    },
    delete: (section:UISection, usage:UIObjectUsage) => {
      handleSections.delete(section);
      setState((prevState) => create(prevState, (draft) => {
        draft.usages = draft.usages?.filter((draftUsage) => draftUsage.section_id !== section.section_id);
        draft.schedules = draft.schedules.filter((schedule) => schedule.usage_id !== usage.usage_id);
      }))
    },
  }

  return (
    <Card style={{marginBlockStart: "10px"}}>
      <Card.Heading>Использование</Card.Heading>
      <Card.Section style={{display: "flex", flexDirection: "column", gap: "20px"}}>
        {state.sections?.filter((section) => section.section_type === sectionTypeEnum.usage).map((section) => (
          <React.Fragment key={section.section_id}>
            <SectionItem section={section} delFunc={(section) => handleUsages.delete(section, section)}/>
            <Textarea name="description" value={section.description} onChange={(e) => handleUsages.value(e, section)} maxLength="2000" />
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