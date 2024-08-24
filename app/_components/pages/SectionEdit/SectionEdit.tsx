"use client";
import Link from "next/link";
import { create } from "mutative";
import { useRouter } from "next/navigation";
import { sectionTypeEnum } from "@/drizzle/schema";
import type { EditSection, ProcSection, ProcSpec, ProcObjectUsage } from "@/app/_types/types";
import { type ChangeEvent, type SyntheticEvent, useEffect, useState } from "react"
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
import { getUsagesByFilters } from "@/app/_db/usage";
import { deleteSectionById, upsertSection } from "@/app/_db/section";


export default function SectionEdit(props:{init:EditSection}) {
  const [ state, setState ] = useState(props.init);
  useEffect(() => setState(props.init), [props.init]);
  const router = useRouter();

  const handleStateChange = {
    value: (e:React.ChangeEvent<HTMLInputElement>) => {
      setState((prevState) => create(prevState, (draft) => {
        (draft as any)[e.target.name] = e.target.value;
      }))
    }
  }

  const handleSpecs = {
    add: (spec:ProcSpec) => {
      if (!spec.spec_id || state.specs?.some((stateSpec) => stateSpec.spec_id === spec.spec_id)) return;
      setState((prevState) => create(prevState, (draft) => {
        if (!draft.specs) draft.specs = [];
        draft.specs.push({...spec, order: draft.specs.length});
      }))
    },
    delete: (id:number) => {
      setState((prevState) => create(prevState, (draft) => {
        draft.specs = draft.specs?.filter((spec) => spec.spec_id !== id);
      }))
    },
    changeOrder: (e:ChangeEvent<HTMLInputElement>, spec:ProcSpec) => {
      setState((prevState) => create(prevState, (draft) => {
        const specItem = draft.specs?.find((draftSpec) => draftSpec.spec_id === spec?.spec_id);
        if (!specItem) return;
        specItem.order = Number(e.target.value);
      }))
    },
  }

  const handleUsages = {
    add: (usage:ProcObjectUsage) => {
      if (!usage.usage_id || state.usages?.some((stateUsage) => stateUsage.usage_id === usage.usage_id)) return;
      setState((prevState) => create(prevState, (draft) => {
        if (!draft.usages) draft.usages = [];
        draft.usages.push({...usage, section_id: -1, section_on_usage_id: -1});
      }))
    },
    delete: (id:number) => {
      setState((prevState) => create(prevState, (draft) => {
        draft.usages = draft.usages?.filter((usage) => usage.usage_id !== id);
      }))
    },
  }

  const handleFormSubmit = async (e:SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    const { section_id } = await upsertSection(state, props.init);
    if (e.nativeEvent.submitter?.dataset?.leavePage) {
      router.push("/admin/sections");
      router.refresh();
    } else {
      router.replace(`/admin/sections/${section_id}`, {scroll: false});
      router.refresh();
    }
  }

  return (
    <Form onSubmit={handleFormSubmit}>
      <Card style={{marginBlockStart: "10px"}}>
        <Card.Heading>Название и тип</Card.Heading>
        <Card.Section>
          <Control>
            <Control.Label>ID</Control.Label>
            <Control.Section>
              <Input value={state?.section_id} disabled/>
            </Control.Section>
          </Control>
          <Control className="mt15">
            <Control.Label>Название (служебное)</Control.Label>
            <Control.Section>
              <Input
                name="name_service"
                value={state?.name_service}
                onChange={handleStateChange.value}
                required
              />
            </Control.Section>
          </Control>
          <Control className="mt15">
            <Control.Label>Название (множественное число)</Control.Label>
            <Control.Section>
              <Input
                name="name_public_plural"
                value={state?.name_public_plural}
                onChange={handleStateChange.value}
                required
              />
            </Control.Section>
          </Control>
          <Control className="mt15">
            <Control.Label>Название (единственное число)</Control.Label>
            <Input
              name="name_public_singular"
              value={state?.name_public_singular}
              onChange={handleStateChange.value}
              required
            />
          </Control>
          <Control className="mt15">
            <Control.Label>Тип раздела</Control.Label>
            <Control.Section>
              <RadioGroup
                name="section_type"
                valueToCompareWith={state?.section_type}
                onChange={handleStateChange.value}
              >
                <Radio value={sectionTypeEnum.section}>Обычный раздел</Radio>
                <Radio value={sectionTypeEnum.common}>Общий раздел</Radio>
              </RadioGroup>
            </Control.Section>
          </Control>
          <Control className="mt15">
            <Control.Label>Тип объекта</Control.Label>
            <Control.Section>
              <RadioGroup
                name="object_type"
                valueToCompareWith={state?.object_type}
                onChange={handleStateChange.value}
                disabled={Boolean(state.specs?.length)}
              >
                <Radio value="org">Организация</Radio>
                <Radio value="place">Место</Radio>
                <Radio value="class">Секция</Radio>
              </RadioGroup>
            </Control.Section>
          </Control>
        </Card.Section>
      </Card>

      <Card style={{marginBlockStart: "10px"}}>
        <Card.Heading>Характеристики</Card.Heading>
        <Card.Section>
          <Select
            isAutocomplete
            onChangeData={handleSpecs.add}
            placeholder="Добавить характеристику"
            requestItemsOnFirstTouch={async () =>
              (await getSpecsByFilters({objectType: state.object_type}))
                ?.map((spec) => ({id: spec.spec_id, label: spec.name_service, data: spec}))
            }
          />
          <ul style={{marginBlockStart: "5px"}}>
            {state?.specs?.toSorted((a, b) => a.order - b.order).map((spec) => (
              <li key={spec.spec_id} style={{display: "flex"}}>
                <Button onClick={() => handleSpecs.delete(spec.spec_id)}>X</Button>
                <InputAddon>{spec.spec_id}</InputAddon>
                <Input value={spec.order} onChange={(e) => handleSpecs.changeOrder(e, spec)} required style={{flex: "0 1 40px"}}/>
                <Link href={`/admin/specs/${spec.spec_id}`} style={{alignSelf: "center"}}>{spec.name_service}</Link>
              </li>
            ))}
          </ul>
        </Card.Section>
      </Card>

      <Card style={{marginBlockStart: "10px"}}>
        <Card.Heading>Использования</Card.Heading>
        <Card.Section>
          <Select
            isAutocomplete
            onChangeData={handleUsages.add}
            placeholder="Добавить использование"
            requestItemsOnFirstTouch={async () =>
              (await getUsagesByFilters({objectType: state.object_type}))
                ?.map((usage) => ({id: usage.usage_id, label: usage.name_service, data: usage}))
            }
          />
          <ul style={{marginBlockStart: "5px"}}>
            {state?.usages?.map((usage) => (
              <li key={usage.usage_id} style={{display: "flex"}}>
                <Button onClick={() => handleUsages.delete(usage.usage_id)}>X</Button>
                <InputAddon>{usage.usage_id}</InputAddon>
                <Link href={`/admin/usages/${usage.usage_id}`} style={{alignSelf: "center"}}>{usage.name_service}</Link>
              </li>
            ))}
          </ul>
        </Card.Section>
      </Card>

      <EditBottomPanel
        id={state?.section_id}
        delFunc={deleteSectionById}
        delRedirectPath="/admin/sections"
        exitRedirectPath="./"
      />
    </Form>
  )
}