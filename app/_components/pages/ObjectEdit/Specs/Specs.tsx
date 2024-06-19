"use client";
import { create } from "mutative";
import React, { ChangeEvent, useContext } from "react";
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
import { UIOption, UISection, UISpec } from "@/app/_types/types";
import { RequiredInput } from "@/app/_components/ui/RequiredInput";


export default function Specs() {
  const { state, setState } = useContext(ObjectEditContext);

  const handleSections = {
    add: (section:UISection) => {
      if (!section.id || state.sections?.some((stateSection) => stateSection.id === section.id)) return;
      setState((prevState) => create(prevState, (draft) => {
        if (!draft.sections) draft.sections = [];
        draft.sections.push(section);
      }))
    },
    delete: (section:UISection) => {
      setState((prevState) => create(prevState, (draft) => {
        draft.sections = draft.sections?.filter(({id}) => id !== section.id);
        const optionsOfDeletedSection = section.specs?.flatMap((spec) => spec.options?.flatMap(({id}) => id));
        draft.options = draft.options?.filter((option) => !optionsOfDeletedSection?.includes(option.id));
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
          draft.options = draft.options.filter(({id}) => id !== opt.id);
        }
      }))
    },
    changeRadio: (spec:UISpec, opt:UIOption) => {
      setState((prevState) => create(prevState, (draft) => {
        if (!draft.options) draft.options = [];
        draft.options = draft.options?.filter((stateOpt) => !spec.options?.map((opt) => opt.id).includes(stateOpt.id));
        draft.options = draft.options?.concat(opt);
      }));
    },
  }

  return (
    <Card style={{marginBlockStart: "10px"}}>
      <Card.Heading>Характеристики</Card.Heading>
      <Card.Section style={{display: "flex", flexDirection: "column", gap: "20px"}}>
        {state.sections?.map((section) => (
          <FieldSet key={section.id} style={{display: "flex", gap: "20px"}}>
            <FieldSet.Legend style={{inlineSize: "200px"}}>
              <Button onClick={() => handleSections.delete(section)}>X</Button>
              <span>{section.name_plural}</span>
            </FieldSet.Legend>
            <FieldSet.Section  style={{display: "flex", gap: "10px"}}>
              {section.specs?.map((spec) => (
                <Control key={spec.id}>
                  <Control.Label>{spec.name_public}</Control.Label>
                  <Control.Section>
                    {spec.options_number === "many"
                      ? <CheckboxGroup arrayToCompareWith={state.options?.map((option) => String(option.id))} required>
                        {spec.options?.map((option) => (
                          <Checkbox key={option.id} value={String(option.id)} onChange={(e) => handleOptions.changeCheckbox(e, option)}>{option.name}</Checkbox>
                        ))}
                        </CheckboxGroup>
                      :
                    spec.options_number === "one"
                      ? <RadioGroup arrayToCompareWith={state.options?.map((option) => String(option.id))} required>
                        {spec.options?.map((option) => (
                          <Radio key={option.id} value={String(option.id)} onChange={() => handleOptions.changeRadio(spec, option)}>{option.name}</Radio>
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
              .map((section) => ({id: section.id!, label: section.name_plural, data: section}))
          }
        />
        <RequiredInput isValidIf={Boolean(state.sections?.length)}/>
      </Card.Section>
    </Card>
  )
}