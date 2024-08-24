import { useContext } from "react";
// -----------------------------------------------------------------------------
import { Button } from "@/app/_components/ui/Button";
import { Control } from "@/app/_components/ui/Control";
import { FieldSet } from "@/app/_components/ui/FieldSet";
import { Checkbox, CheckboxGroup, Radio, RadioGroup } from "@/app/_components/ui/Choice";
// -----------------------------------------------------------------------------
import { ObjectEditContext } from "../ObjectEdit";
import type { ProcSection } from "@/app/_types/types";


export default function SectionItem(props:{section:ProcSection, delFunc:(section:ProcSection) => void}) {
  const { section } = props;
  const { state, handleOptions } = useContext(ObjectEditContext);

  return (
    <FieldSet key={section?.section_id} style={{display: "flex", gap: "20px"}}>
      <FieldSet.Legend style={{inlineSize: "200px"}}>
        <Button onClick={() => props.delFunc(section)}>X</Button>
        <span>{section?.name_public_singular}</span>
      </FieldSet.Legend>
      <FieldSet.Section style={{display: "flex", gap: "10px"}}>
        {section?.specs?.toSorted((a, b) => a.order - b.order).map((spec) => (
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
  )
}