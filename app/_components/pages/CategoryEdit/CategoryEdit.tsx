"use client";
import Link from "next/link";
import { create } from "mutative";
import { useRouter } from "next/navigation";
import { type SyntheticEvent, useEffect, useState } from "react";
import { objectTypeEnum, sectionTypeEnum } from "@/drizzle/schema";
import type { EditCategory, ProcSection } from "@/app/_types/types";
// -----------------------------------------------------------------------------
import { Form } from "../../ui/Form";
import { Card } from "../../ui/Card";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { Select } from "../../ui/Select";
import { Control } from "../../ui/Control";
import { EditBottomPanel } from "../../blocks/EditBottomPanel";
// -----------------------------------------------------------------------------
import { deleteCategoryById, upsertCategory } from "@/app/_db/category";
import { getSectionsByFilters } from "@/app/_db/section";


export default function CategoryEdit(props:{init:EditCategory}) {
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

  const handleSections = {
    add: (section:ProcSection) => {
      if (!section.section_id || state.sections?.some((stateSection) => stateSection.section_id === section.section_id)) return;
      setState((prevState) => create(prevState, (draft) => {
        if (!draft.sections) draft.sections = [];
        draft.sections.push(section);
      }))
    },
    delete: (id:number) => {
      setState((prevState) => create(prevState, (draft) => {
        draft.sections = draft.sections?.filter((section) => section.section_id !== id);
      }))
    },
  }

  const handleFormSubmit = async (e:SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    const { category_id } = await upsertCategory(state, props.init);
    if (e.nativeEvent.submitter?.dataset?.leavePage) {
      router.push("/admin/categories");
      router.refresh();
    } else {
      router.replace(`/admin/categories/${category_id}`, {scroll: false});
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
              <Input value={state.category_id} disabled/>
            </Control.Section>
          </Control>
          <Control className="mt15">
            <Control.Label>Order</Control.Label>
            <Control.Section>
              <Input name="order" value={state.order} onChange={handleStateChange.value}/>
            </Control.Section>
          </Control>
          <Control className="mt15">
            <Control.Label>Название</Control.Label>
            <Control.Section>
              <Input
                name="name"
                value={state.name}
                onChange={handleStateChange.value}
                required
              />
            </Control.Section>
          </Control>
        </Card.Section>
      </Card>

      <Card style={{marginBlockStart: "10px"}}>
        <Card.Heading>Разделы</Card.Heading>
        <Card.Section>
          <Select
            isAutocomplete
            onChangeData={handleSections.add}
            placeholder="Добавить раздел"
            requestItemsOnFirstTouch={async () =>
              (await getSectionsByFilters({sectionType: sectionTypeEnum.section}))
                ?.map((section) => ({id: section.section_id, label: section.name_service, data: section}))
            }
          />
        </Card.Section>
        <Card.Section style={{display: "flex"}}>
          <div style={{flexBasis: "33%"}}>
            <p style={{marginBlockStart: "15px"}}>Организации</p>
            <ul style={{marginBlockStart: "5px"}}>
              {state.sections?.filter((section) => section.object_type === objectTypeEnum.org).map((section) => (
                <li key={section.section_id} style={{display: "flex"}}>
                  <Button onClick={() => handleSections.delete(section.section_id)}>X</Button>
                  <Link href={`/admin/sections/${section.section_id}`} style={{alignSelf: "center"}}>{section.name_service}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div style={{flexBasis: "33%"}}>
            <p style={{marginBlockStart: "15px"}}>Места</p>
            <ul style={{marginBlockStart: "5px"}}>
              {state.sections?.filter((section) => section.object_type === objectTypeEnum.place).map((section) => (
                <li key={section.section_id} style={{display: "flex"}}>
                  <Button onClick={() => handleSections.delete(section.section_id)}>X</Button>
                  <Link href={`/admin/sections/${section.section_id}`} style={{alignSelf: "center"}}>{section.name_service}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div style={{flexBasis: "33%"}}>
            <p style={{marginBlockStart: "15px"}}>Секции</p>
            <ul style={{marginBlockStart: "5px"}}>
              {state.sections?.filter((section) => section.object_type === objectTypeEnum.class).map((section) => (
                <li key={section.section_id} style={{display: "flex"}}>
                  <Button onClick={() => handleSections.delete(section.section_id)}>X</Button>
                  <Link href={`/admin/sections/${section.section_id}`} style={{alignSelf: "center"}}>{section.name_service}</Link>
                </li>
              ))}
            </ul>
          </div>
        </Card.Section>
      </Card>

      <EditBottomPanel
        id={state.category_id}
        delFunc={deleteCategoryById}
        delRedirectPath="/admin/sections"
        exitRedirectPath="./"
      />
    </Form>
  )
}