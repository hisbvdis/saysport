"use client";
import Link from "next/link";
import { create } from "mutative";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useEffect, useState } from "react"
// -----------------------------------------------------------------------------
import { Form } from "@/app/_components/ui/Form";
import { Card } from "@/app/_components/ui/Card";
import { Input } from "@/app/_components/ui/Input";
import { Button } from "@/app/_components/ui/Button";
import { Select } from "@/app/_components/ui/Select";
import { Control } from "@/app/_components/ui/Control";
import { InputAddon } from "@/app/_components/ui/InputAddon";
import { Radio, RadioGroup } from "@/app/_components/ui/Choice";
import { EditBottomPanel } from "@/app/_components/blocks/EditBottomPanel";
// -----------------------------------------------------------------------------
import { getSpecsByFilters } from "@/app/_db/spec";
import { UISection, UISpec } from "@/app/_types/types";
import { deleteSectionById, upsertSection } from "@/app/_db/section";


export default function SectionEdit(props:{init:UISection}) {
  const [ state, setState ] = useState(props.init);
  useEffect(() => setState(props.init), [props.init]);
  const router = useRouter();

  const handleStateChange = {
    value: (e:React.ChangeEvent<HTMLInputElement>) => {
      setState(create(state, (draft) => {
        (draft as any)[e.target.name] = e.target.value;
      }))
    }
  }

  const handleSpecs = {
    add: (spec:UISpec) => {
      if (!spec.id || state.specs?.some((stateSpec) => stateSpec.id === spec.id)) return;
      setState(create(state, (draft) => {
        if (!draft.specs) draft.specs = [];
        draft.specs.push(spec);
      }))
    },
    delete: (id:number) => {
      setState(create(state, (draft) => {
        draft.specs = draft.specs?.filter((spec) => spec.id !== id);
      }))
    },
  }

  const handleFormSubmit = async (e:SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    const { id } = await upsertSection(state, props.init);
    if (e.nativeEvent.submitter?.dataset?.leavePage) {
      router.push("/admin/sections");
      router.refresh();
    } else {
      router.replace(`/admin/sections/${id}`, {scroll: false});
      router.refresh();
    }
  }

  return (
    <Form onSubmit={handleFormSubmit}>
      <Card style={{marginBlockStart: "10px"}}>
        <Card.Heading>Name and type</Card.Heading>
        <Card.Section>
          <Control>
            <Control.Label>ID</Control.Label>
            <Control.Section>
              <Input value={state?.id} disabled/>
            </Control.Section>
          </Control>
          <Control style={{marginBlockStart: "5px"}}>
            <Control.Label>Name (plural)</Control.Label>
            <Control.Section>
              <Input
                name="name_plural"
                value={state?.name_plural}
                onChange={handleStateChange.value}
                required
              />
            </Control.Section>
          </Control>
          <Control style={{marginBlockStart: "5px"}}>
            <Control.Label>Name (singular)</Control.Label>
            <Input
              name="name_singular"
              value={state?.name_singular}
              onChange={handleStateChange.value}
              required
            />
          </Control>
          <Control style={{marginBlockStart: "5px"}}>
            <Control.Label>Object type</Control.Label>
            <Control.Section>
              <RadioGroup
                name="object_type"
                valueToCompareWith={state?.object_type}
                onChange={handleStateChange.value}
                disabled={Boolean(state.specs?.length)}
              >
                <Radio value="org">Org</Radio>
                <Radio value="place">Place</Radio>
              </RadioGroup>
            </Control.Section>
          </Control>
        </Card.Section>
      </Card>

      <Card style={{marginBlockStart: "10px"}}>
        <Card.Heading>Specs</Card.Heading>
        <Card.Section>
          <Select
            isAutocomplete
            onChangeData={handleSpecs.add}
            placeholder="Add spec"
            requestItemsOnFirstTouch={async () =>
              (await getSpecsByFilters({objectType: state?.object_type}))
                ?.map((spec) => ({id: spec.id, label: spec.name_service, data: spec}))
            }
          />
          <ul style={{marginBlockStart: "5px"}}>
            {state?.specs?.map((spec) => (
              <li key={spec.id}>
                <Button onClick={() => handleSpecs.delete(spec.id!)}>X</Button>
                <InputAddon>{spec.id}</InputAddon>
                <Link href={`/admin/specs/${spec.id}`}>{spec.name_service}</Link>
              </li>
            ))}
          </ul>
        </Card.Section>
      </Card>

      <EditBottomPanel
        id={state?.id}
        delFunc={deleteSectionById}
        delRedirectPath="/admin/sections"
        exitRedirectPath="./"
      />
    </Form>
  )
}