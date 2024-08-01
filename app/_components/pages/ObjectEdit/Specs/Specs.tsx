"use client";
import { create } from "mutative";
import React, { type ChangeEvent, useContext } from "react";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
import { Select } from "@/app/_components/ui/Select";
import { Button } from "@/app/_components/ui/Button";
import { Control } from "@/app/_components/ui/Control";
import { FieldSet } from "@/app/_components/ui/FieldSet";
import { Checkbox, CheckboxGroup, Radio, RadioGroup } from "@/app/_components/ui/Choice";
// -----------------------------------------------------------------------------
import { ObjectEditContext } from "../ObjectEdit";
import { getSectionsByFilters } from "@/app/_db/section";
import type { UIOption, UISection, UISpec } from "@/app/_types/types";
import { RequiredInput } from "@/app/_components/ui/RequiredInput";
import { objectTypeEnum, sectionTypeEnum } from "@/drizzle/schema";


export default function Specs() {
  const { state, setState } = useContext(ObjectEditContext);

  const handleSections = {
    add: (section:UISection) => {
      if (!section.section_id || state.sections?.some((stateSection) => stateSection.section_id === section.section_id)) return;
      setState((prevState) => create(prevState, (draft) => {
        if (!draft.sections) draft.sections = [];
        draft.sections.push(section);
      }))
    },
    delete: (section:UISection) => {
      setState((prevState) => create(prevState, (draft) => {
        draft.sections = draft.sections?.filter(({section_id}) => section_id !== section.section_id);
        const optionsOfDeletedSection = section.specs?.flatMap((spec) => spec.options?.flatMap(({spec_id}) => spec_id));
        draft.options = draft.options?.filter((option) => !optionsOfDeletedSection?.includes(option.option_id));
      }));
    },
  }

  const handleOptions = {
    changeCheckbox: (e:ChangeEvent<HTMLInputElement>, opt: UIOption) => {
      setState((prevState) => create(prevState, (draft) => {
        if (!draft.options) draft.options = [];
        if (e.target.checked) {
          draft.options = draft.options.concat(opt);
        } else {
          draft.options = draft.options.filter(({option_id}) => option_id !== opt.option_id);
        }
      }))
    },
    changeRadio: (spec:UISpec, opt:UIOption) => {
      setState((prevState) => create(prevState, (draft) => {
        if (!draft.options) draft.options = [];
        draft.options = draft.options?.filter((stateOpt) => !spec.options?.map((opt) => opt.option_id).includes(stateOpt.option_id));
        draft.options = draft.options?.concat(opt);
      }));
    },
  }

  return (
    <Card style={{marginBlockStart: "10px"}}>
      <Card.Heading>Характеристики</Card.Heading>
      <Card.Section style={{display: "flex", flexDirection: "column", gap: "20px"}}>
        {state.sections.filter((section) => section.section_type !== sectionTypeEnum.usage).map((section) => (
          <FieldSet key={section.section_id} style={{display: "flex", gap: "20px"}}>
            <FieldSet.Legend style={{inlineSize: "200px"}}>
              <Button onClick={() => handleSections.delete(section)}>X</Button>
              <span>{section.name_singular}</span>
            </FieldSet.Legend>
            <FieldSet.Section  style={{display: "flex", gap: "10px"}}>
              {section.specs?.map((spec) => (
                <Control key={spec.spec_id}>
                  <Control.Label>{spec.name_public}</Control.Label>
                  <Control.Section>
                    {spec.options_number === "many"
                      ? <CheckboxGroup arrayToCompareWith={state.options?.map((option) => String(option.option_id))} required>
                        {spec.options?.toSorted((a, b) => a.order - b.order).map((option) => (
                          <Checkbox key={option.option_id} value={String(option.option_id)} onChange={(e) => handleOptions.changeCheckbox(e, option)}>{option.name}</Checkbox>
                        ))}
                        </CheckboxGroup>
                      :
                    spec.options_number === "one"
                      ? <RadioGroup arrayToCompareWith={state.options?.map((option) => String(option.option_id))} required>
                        {spec.options?.toSorted((a, b) => a.order - b.order).map((option) => (
                          <Radio key={option.option_id} value={String(option.option_id)} onChange={() => handleOptions.changeRadio(spec, option)}>{option.name}</Radio>
                        ))}
                        </RadioGroup>
                      : ""}
                  </Control.Section>
                </Control>
              ))}
            </FieldSet.Section>
          </FieldSet>
        ))}
      </Card.Section>
      <Card.Section>
        <Select
          isAutocomplete
          value=""
          onChangeData={handleSections.add}
          placeholder="Добавить раздел"
          requestItemsOnFirstTouch={async () =>
            (await getSectionsByFilters({objectType: state.type}))
              .map((section) => ({id: section.section_id, label: section.name_plural, data: section}))
          }
        />
        <RequiredInput isValidIf={state.type === objectTypeEnum.org ? Boolean(state.sections.filter((section) => section.section_type !== sectionTypeEnum.usage).length > 0) : Boolean(state.sections.filter((section) => section.section_type !== sectionTypeEnum.usage).length > 1)}/>
      </Card.Section>
    </Card>
  )
}