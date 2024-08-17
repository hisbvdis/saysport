"use client";
import { create } from "mutative";
import { costTypeEnum, objectTypeEnum, sectionTypeEnum } from "@/drizzle/schema";
import type { UISection, UIUsage } from "@/app/_types/types";
import React, { type ChangeEvent, SyntheticEvent, useContext } from "react";
// -----------------------------------------------------------------------------
import { SectionItem, Schedule } from "../";
import { Card } from "@/app/_components/ui/Card";
import { ObjectEditContext } from "../ObjectEdit";
import { Select } from "@/app/_components/ui/Select";
import { Textarea } from "@/app/_components/ui/Input";
// -----------------------------------------------------------------------------
import { getSectionsByFilters } from "@/app/_db/section";
import { FieldSet } from "@/app/_components/ui/FieldSet";
import { Button } from "@/app/_components/ui/Button";
import { Control } from "@/app/_components/ui/Control";
import { Checkbox, CheckboxGroup, Radio, RadioGroup } from "@/app/_components/ui/Choice";
import { getUsagesByFilters } from "@/app/_db/usage";


export default function Usages() {
  const { state, setState } = useContext(ObjectEditContext);

  const handleUsages = {
    add: (usage:UIUsage) => {
      setState((prevState) => create(prevState, (draft) => {
        if (!draft.usages) draft.usages = [];
        draft.usages.push({...usage, order: draft.usages.length, uiID: crypto.randomUUID()});
      }))
    },
    delete: (usage:UIUsage) => {
      setState((prevState) => create(prevState, (draft) => {
        draft.usages = draft.usages?.filter((draftUsage) => draftUsage.usage_id !== usage.usage_id);
      }));
    },
    description: (e:ChangeEvent<HTMLInputElement>, usage:UIUsage) => {
      setState((prevState) => create(prevState, (draft) => {
        const usageItem = draft.usages.find((draftUsage) => draftUsage.usage_id === usage.usage_id);
        if (!usageItem) return;
        usageItem.description = e.target.value;
      }));
    },
    cost: (e:ChangeEvent<HTMLInputElement>, usage:UIUsage) => {
      setState((prevState) => create(prevState, (draft) => {
        const usageItem = draft.usages.find((draftUsage) => draftUsage.usage_id === usage.usage_id);
        if (!usageItem) return;
        usageItem.cost = e.target.value as costTypeEnum;
      }));
    },
  }

  return (
    <Card style={{marginBlockStart: "10px"}}>
      <Card.Heading>Использование</Card.Heading>
      {state.usages?.map((usage, i) => ({...usage, order: i})).map((usage) => (
        <Card.Section key={usage.uiID} style={{display: "flex", flexDirection: "column", gap: "15px"}}>
          <FieldSet style={{display: "flex", gap: "20px"}}>
            <FieldSet.Legend style={{inlineSize: "200px"}}>
              <Button onClick={() => handleUsages.delete(usage)}>X</Button>
              <span>{usage?.name_public}</span>
            </FieldSet.Legend>
            <FieldSet.Section style={{display: "flex", gap: "10px"}}>
            {state.type !== objectTypeEnum.org && (
              <Control>
                <Control.Label>Стоимость</Control.Label>
                <Control.Section>
                  <RadioGroup
                    valueToCompareWith={usage.cost ?? undefined}
                    onChange={(e) => handleUsages.cost(e, usage)}
                    required
                  >
                    <Radio value={costTypeEnum.paid}>Платно</Radio>
                    <Radio value={costTypeEnum.free}>Бесплатно</Radio>
                  </RadioGroup>
                </Control.Section>
              </Control>
            )}
            </FieldSet.Section>
          </FieldSet>
          <Textarea name="description" value={usage.description} onChange={(e) => handleUsages.description(e, usage)} maxLength="2000" />
          <Schedule usage={usage}/>
        </Card.Section>
      ))}
      <Card.Section>
        <Select
          isAutocomplete
          value=""
          onChangeData={handleUsages.add}
          placeholder="Добавить использование"
          requestItemsOnFirstTouch={async () =>
            (await getUsagesByFilters({objectType: state.type}))
              .map((usage) => ({id: usage.usage_name_id, label: usage.name_service, data: usage}))
          }
        />
        {/* <RequiredInput isValidIf={Boolean(state.sections.filter((section) => section.section_type === sectionTypeEnum.usage).length > 0)}/> */}
      </Card.Section>
    </Card>
  )
}