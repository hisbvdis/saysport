"use client";
import { create } from "mutative";
import { useRouter } from "next/navigation";
import { type ChangeEvent, type SyntheticEvent, useEffect, useState } from "react";
// -----------------------------------------------------------------------------
import { Form } from "@/app/_components/ui/Form";
import { Card } from "@/app/_components/ui/Card";
import { Input } from "@/app/_components/ui/Input";
import { Checkbox, Radio } from "@/app/_components/ui/Choice";
import { Button } from "@/app/_components/ui/Button";
import { Control } from "@/app/_components/ui/Control";
import { InputAddon } from "@/app/_components/ui/InputAddon";
import { RadioGroup } from "@/app/_components/ui/Choice/ChoiceGroup";
import { EditBottomPanel } from "@/app/_components/blocks/EditBottomPanel";
// -----------------------------------------------------------------------------
import type { UISpec } from "@/app/_types/types";
import { deleteSpecById, upsertSpec } from "@/app/_db/spec";


export default function SpecEdit(props:{init:UISpec}) {
  const [state, setState] = useState(props.init);
  useEffect(() => setState(props.init), [props.init]);
  const router = useRouter();

  const handleStateChange = {
    value: (e:React.ChangeEvent<HTMLInputElement>) => {
      setState((prevState) => create(prevState, (draft) => {
        (draft as any)[e.target.name] = e.target.value;
      }))
    },
    checked: (e:ChangeEvent<HTMLInputElement>) => {
      setState((prevState) => create(prevState, (draft) => {
        (draft as any)[e.target.name] = e.target.checked;
      }));
    },
  }

  const handleOptions = {
    add: () => {
      setState((prevState) => create(prevState, (draft) => {
        if (!draft?.options) draft.options = [];
        draft.options.push({option_id: 0, spec_id: 0, name: "", order: draft.options.length, uiID: crypto.randomUUID()});
      }))
    },
    changeName: (e:ChangeEvent<HTMLInputElement>, uiID:string) => {
      setState((prevState) => create(prevState, (draft) => {
        const option = draft.options?.find((option) => option.uiID === uiID);
        if (!option) return;
        option.name = e.target.value;
      }))
    },
    changeOrder: (e:ChangeEvent<HTMLInputElement>, uiID:string) => {
      setState((prevState) => create(prevState, (draft) => {
        const option = draft.options?.find((option) => option.uiID === uiID);
        if (!option) return;
        option.order = Number(e.target.value);
      }))
    },
    delete: (uiID:string) => {
      setState((prevState) => create(prevState, (draft) => {
        draft.options = draft.options?.filter((option) => option.uiID !== uiID);
      }))
    }
  }

  const handleFormSubmit = async (e:SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    const { spec_id } = await upsertSpec(state, props.init);
    if (e.nativeEvent.submitter?.dataset?.leavePage) {
      router.push("/admin/specs");
      router.refresh();
    } else {
      router.replace(`/admin/specs/${spec_id}`, {scroll: false});
      router.refresh();
    }
  }

  return (
    <Form style={{marginBlockStart: "10px"}} onSubmit={handleFormSubmit}>
      <Card>
        <Card.Heading>Название и тип</Card.Heading>
        <Card.Section>
          <Control>
            <Control.Label>ID</Control.Label>
            <Control.Section>
              <Input value={state?.spec_id ?? ""} disabled/>
            </Control.Section>
          </Control>
          <Control className="mt15">
            <Control.Label>Order</Control.Label>
            <Control.Section>
              <Input value={state?.order} disabled/>
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
            <Control.Label>Название (публичное)</Control.Label>
            <Control.Section>
              <Input
                name="name_public"
                value={state?.name_public}
                onChange={handleStateChange.value}
                required
              />
            </Control.Section>
          </Control>
          <Control className="mt15">
            <Control.Label>Тип объекта</Control.Label>
            <RadioGroup
              name="object_type"
              valueToCompareWith={state.object_type}
              onChange={handleStateChange.value}
            >
              <Radio value="org">Организация</Radio>
              <Radio value="place">Место</Radio>
            </RadioGroup>
          </Control>
        </Card.Section>
      </Card>

      <Card style={{marginBlockStart: "10px"}}>
        <Card.Heading>Страница "Редактировать"</Card.Heading>
        <Card.Section>
          <Control>
            <Control.Label>Количество опций</Control.Label>
            <Control.Section>
              <RadioGroup
                name="options_number"
                valueToCompareWith={state.options_number}
                onChange={handleStateChange.value}
              >
                <Radio value="many">Много</Radio>
                <Radio value="one">Одна</Radio>
              </RadioGroup>
            </Control.Section>
          </Control>
        </Card.Section>
      </Card>

      <Card style={{marginBlockStart: "10px"}}>
        <Card.Heading>Страница "Поиск"</Card.Heading>
        <Card.Section>
          <Control>
            <Control.Section>
              <Checkbox name="is_and_in_search" checked={Boolean(state.is_and_in_search)} onChange={handleStateChange.checked}>
                Показывать режим поиска "И"
              </Checkbox>
            </Control.Section>
          </Control>
        </Card.Section>
      </Card>

      <Card style={{marginBlockStart: "10px"}}>
        <Card.Heading style={{display: "flex", justifyContent: "space-between"}}>
          <span>Опции</span>
          <Button onClick={handleOptions.add}>+</Button>
        </Card.Heading>
        <Card.Section>
          <ul style={{paddingInlineStart: 0}}>
            {state.options?.toSorted((a, b) => a.order - b.order).map((option) => (
              <li key={option.uiID} style={{display: "flex"}}>
                <Button onClick={() => handleOptions.delete(option.uiID)} tabIndex={-1}>X</Button>
                <InputAddon>{option.option_id}</InputAddon>
                <Input value={option.order} onChange={(e) => handleOptions.changeOrder(e, option.uiID)} required style={{flex: "0 1 40px"}}/>
                <Input value={option.name} onChange={(e) => handleOptions.changeName(e, option.uiID)} required/>
              </li>
            ))}
          </ul>
        </Card.Section>
      </Card>

      <EditBottomPanel
        id={state.spec_id}
        delFunc={deleteSpecById}
        delRedirectPath="/admin/specs"
        exitRedirectPath="./"
      />
    </Form>
  )
}