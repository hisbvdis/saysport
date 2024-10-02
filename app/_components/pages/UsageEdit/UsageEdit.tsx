"use client";
import { create } from "mutative";
import { useRouter } from "next/navigation";
import type { UIUsage } from "@/app/_types/db";
import { type SyntheticEvent, useEffect, useState } from "react";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
import { Input } from "@/app/_components/ui/Input";
import { Control } from "@/app/_components/ui/Control";
import { Radio, RadioGroup } from "@/app/_components/ui/Choice";
import { EditBottomPanel } from "@/app/_components/blocks/EditBottomPanel";
// -----------------------------------------------------------------------------
import { deleteUsageById, upsertUsage } from "@/app/_actions/db/usage";


export default function UsageEdit(props:{init:UIUsage}) {
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

  const handleFormSubmit = async (e:SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    const { usage_id } = await upsertUsage(state, props.init);
    if (e.nativeEvent.submitter?.dataset?.leavePage) {
      router.push("/admin/usages");
      router.refresh();
    } else {
      router.replace(`/admin/usages/${usage_id}`, {scroll: false});
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <Card style={{marginBlockStart: "10px"}}>
        <Card.Heading>Название и тип</Card.Heading>
        <Card.Section>
          <Control>
            <Control.Label>ID</Control.Label>
            <Control.Section>
              <Input value={state?.usage_id} disabled/>
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
            <Control.Section>
              <RadioGroup
                name="object_type"
                valueToCompareWith={state?.object_type}
                onChange={handleStateChange.value}
                // disabled={Boolean(state.specs?.length)}
              >
                <Radio value="org">Организация</Radio>
                <Radio value="place">Место</Radio>
                <Radio value="class">Секция</Radio>
              </RadioGroup>
            </Control.Section>
          </Control>
        </Card.Section>
      </Card>

      <EditBottomPanel
        id={state?.usage_id}
        delFunc={deleteUsageById}
        delRedirectPath="/admin/sections"
        exitRedirectPath="./"
      />
    </form>
  )
}