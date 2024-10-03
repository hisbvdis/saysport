"use client";
import Link from "next/link";
import React, { useContext } from "react";
import { objectTypeEnum, sectionTypeEnum } from "@/drizzle/schema";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
import { ObjectEditContext } from "../ObjectEdit";
import { Button } from "@/app/_components/ui/Button";
import { Select } from "@/app/_components/ui/Select";
import { Control } from "@/app/_components/ui/Control";
import { FieldSet } from "@/app/_components/ui/FieldSet";
import { RequiredInput } from "@/app/_components/ui/RequiredInput";
import { Checkbox, CheckboxGroup, Radio, RadioGroup } from "@/app/_components/ui/Choice";
// -----------------------------------------------------------------------------
import { getSectionsByFilters } from "@/app/_actions/db/section";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function Sections() {
  const { state, handleSections, handleOptions } = useContext(ObjectEditContext);

  return (
    <Card style={{marginBlockStart: "10px"}}>
      <Card.Heading>Разделы</Card.Heading>
      {state.sections?.filter((section) => section.section_type === sectionTypeEnum.section || section.section_type === sectionTypeEnum.common).map((section) => (
        <Card.Section key={section.section_id} style={{display: "flex", flexDirection: "column", gap: "20px"}}>
          <FieldSet key={section?.section_id} >
            <FieldSet.Legend style={{display: "flex", gap: "5px", alignItems: "center"}}>
              <Button onClick={() => handleSections.delete(section)} disabled={section.section_type === sectionTypeEnum.common}>X</Button>
              <Link className={styles["sections__sectionName"]} href={`/admin/sections/${section.section_id}`}>{section?.name_public_singular}</Link>
            </FieldSet.Legend>
            <FieldSet.Section style={{display: "flex", gap: "15px", marginBlockStart: "5px"}}>
              {section?.specs?.toSorted((a, b) => a.order - b.order).map((spec) => (
                <Control key={spec.spec_id}>
                  <Control.Label>
                    <Link className={styles["sections__specName"]} href={`/admin/specs/${spec.spec_id}`}>{spec.name_public}</Link>
                  </Control.Label>
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
        </Card.Section>
      ))}
      <Card.Section>
        <Select
          isAutocomplete
          value=""
          onChangeData={handleSections.add}
          placeholder="Добавить раздел"
          requestItemsOnFirstTouch={async () =>
            (await getSectionsByFilters({objectType: state.type, sectionType: sectionTypeEnum.section}))
              .map((section) => ({id: String(section.section_id), label: section.name_service, data: section}))
          }
        />
        <RequiredInput isValidIf={state.type === objectTypeEnum.place ? Boolean(state.sections.length > 1) : Boolean(state.sections.length > 0) }/>
      </Card.Section>
    </Card>
  )
}