"use client";
import Link from "next/link";
import { create } from "mutative";
import { useRouter } from "next/navigation";
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
import type { UISection, UISpec } from "@/app/_types/types";
import { deleteSectionById, getSectionsByFilters, upsertSection } from "@/app/_db/section";
import { objectTypeEnum, sectionTypeEnum } from "@/drizzle/schema";


export default function SectionEdit(props:{init:UISection}) {
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
    add: (spec:UISpec) => {
      if (!spec.spec_id || state.specs?.some((stateSpec) => stateSpec.spec_id === spec.spec_id)) return;
      setState((prevState) => create(prevState, (draft) => {
        if (!draft.specs) draft.specs = [];
        draft.specs.push(spec);
      }))
    },
    delete: (id:number) => {
      setState((prevState) => create(prevState, (draft) => {
        draft.specs = draft.specs?.filter((spec) => spec.spec_id !== id);
      }))
    },
    changeOrder: (e:ChangeEvent<HTMLInputElement>, uiID:string) => {
      setState((prevState) => create(prevState, (draft) => {
        const spec = draft.specs?.find((spec) => spec.uiID === uiID);
        if (!spec) return;
        spec.order = Number(e.target.value);
      }))
    },
  }

  const handleUsages = {
    add: (section:UISection) => {
      if (state.usages?.some((stateUsage) => stateUsage.section_id === section.section_id)) return;
      setState((prevState) => create(prevState, (draft) => {
        if (!draft.usages) draft.usages = [];
        draft.usages.push(section);
      }))
    },
    delete: (id:number) => {
      setState((prevState) => create(prevState, (draft) => {
        draft.usages = draft.usages?.filter((usage) => usage.section_id !== id);
      }))
    },
    // changeOrder: (e:ChangeEvent<HTMLInputElement>, uiID:string) => {
    //   setState((prevState) => create(prevState, (draft) => {
    //     const spec = draft.specs?.find((spec) => spec.uiID === uiID);
    //     if (!spec) return;
    //     spec.order = Number(e.target.value);
    //   }))
    // },
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
                <Radio value={sectionTypeEnum.usage}>Использование</Radio>
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
                <Input value={spec.order} onChange={(e) => handleSpecs.changeOrder(e, spec.uiID)} required style={{flex: "0 1 40px"}}/>
                <Link href={`/admin/specs/${spec.spec_id}`} style={{alignSelf: "center"}}>{spec.name_service}</Link>
              </li>
            ))}
          </ul>
        </Card.Section>
      </Card>

      {state.object_type !== objectTypeEnum.org && state.section_type !== sectionTypeEnum.usage ? (
        <Card style={{marginBlockStart: "10px"}}>
          <Card.Heading>Использование</Card.Heading>
          <Card.Section>
            <Select
              isAutocomplete
              onChangeData={handleUsages.add}
              placeholder="Добавить характеристику"
              requestItemsOnFirstTouch={async () =>
                (await getSectionsByFilters({objectType: state.object_type, sectionType: sectionTypeEnum.usage}))
                  .map((section) => ({id: section.section_id, label: section.name_service, data: section}))
              }
            />
            <ul style={{marginBlockStart: "5px"}}>
              {state?.usages?.map((section) => (
                <li key={section.section_id} style={{display: "flex"}}>
                  <Button onClick={() => handleUsages.delete(section.section_id)}>X</Button>
                  <InputAddon>{section.section_id}</InputAddon>
                  {/* <Input value={section.order} onChange={(e) => handleSpecs.changeOrder(e, section.uiID)} required style={{flex: "0 1 40px"}}/> */}
                  <Link href={`/admin/specs/${section.section_id}`} style={{alignSelf: "center"}}>{section.name_service}</Link>
                </li>
              ))}
            </ul>
          </Card.Section>
        </Card>
      ) : null}

      <EditBottomPanel
        id={state?.section_id}
        delFunc={deleteSectionById}
        delRedirectPath="/admin/sections"
        exitRedirectPath="./"
      />
    </Form>
  )
}