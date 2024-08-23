"use client";
import type React from "react";
import { create } from "mutative";
import type { UIUsage } from "@/app/_types/types";
import { type ChangeEvent, useContext } from "react";
import { costTypeEnum, type ObjectSchedule, objectTypeEnum } from "@/drizzle/schema";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
import { ObjectEditContext } from "../ObjectEdit";
import { Select } from "@/app/_components/ui/Select";
import { Button } from "@/app/_components/ui/Button";
import { Textarea } from "@/app/_components/ui/Input";
import { Control } from "@/app/_components/ui/Control";
import { FieldSet } from "@/app/_components/ui/FieldSet";
import { Checkbox, Radio, RadioGroup } from "@/app/_components/ui/Choice";
// -----------------------------------------------------------------------------
import { getUsagesByFilters } from "@/app/_db/usage";


export default function Usages() {
  const { state, setState } = useContext(ObjectEditContext);

  const handleUsages = {
    add: (usage:UIUsage) => {
      setState((prevState) => create(prevState, (draft) => {
        if (!draft.usages) draft.usages = [];
        draft.usages = draft.usages.concat({...usage, uiID: crypto.randomUUID()}).map((usage, i) => ({...usage, order: i}));
      }))
    },
    delete: (usage:UIUsage) => {
      setState((prevState) => create(prevState, (draft) => {
        draft.usages = draft.usages?.filter((draftUsage) => draftUsage.uiID !== usage.uiID).map((usage, i) => ({...usage, order: i}));
      }));
    },
    description: (e:ChangeEvent<HTMLInputElement>, usage:UIUsage) => {
      setState((prevState) => create(prevState, (draft) => {
        const usageItem = draft.usages.find((draftUsage) => draftUsage.uiID === usage.uiID);
        if (!usageItem) return;
        usageItem.description = e.target.value;
      }));
    },
    cost: (e:ChangeEvent<HTMLInputElement>, usage:UIUsage) => {
      setState((prevState) => create(prevState, (draft) => {
        const usageItem = draft.usages.find((draftUsage) => draftUsage.uiID === usage.uiID);
        if (!usageItem) return;
        usageItem.cost = e.target.value as costTypeEnum;
      }));
    },
  }

  const handleSchedule = {
    changeTime: (e:React.ChangeEvent<HTMLInputElement>, usage:UIUsage) => {
      const dayNum = Number(e.target.name);
      setState((prevState) => create(prevState, (draft) => {
        const usageItem = draft.usages.find((draftUsage) => draftUsage.uiID === usage.uiID);
        if (!usageItem) return;
        if (!usageItem.schedules) usage.schedules = [];
        const scheduleItem = usageItem?.schedules?.find((draftSchedule) => draftSchedule.day_num === dayNum);
        if (scheduleItem) {
          scheduleItem.time = e.target.value;
        } else {
          usageItem.schedules = usageItem?.schedules?.concat({day_num: dayNum, time: e.target.value, uiID: crypto.randomUUID(), object_on_usage_id: -1, object_id: -1, schedule_id: -1, from: 0, to: 0})
        }
      }))
    },
    formatTime: (e:React.FocusEvent<HTMLInputElement>, usage:UIUsage) => {
      const dayNum = Number(e.target.name);
      const times = e.target.value
        .split("\n")
        .map((time) => {
          const matching = time.trim().match(/(\d{1,2}):?(\d{2})?\s?-\s?(\d{1,2}):?(\d{2})?$/);
          if (!matching) return time;
          const [_, hoursFrom, minutesFrom, hoursTo, minutesTo] = matching;
          return `${hoursFrom}:${minutesFrom ?? "00"} - ${hoursTo}:${minutesTo ?? "00"}`
        })
        .join("\n");
      setState((prevState) => create(prevState, (draft) => {
        const usageItem = draft.usages.find((draftUsage) => draftUsage.uiID === usage.uiID);
        if (!usageItem) return;
        if (!usageItem.schedules) usage.schedules = [];
        const scheduleItem = usageItem?.schedules?.find((draftSchedule) => draftSchedule.day_num === dayNum);
        if (!scheduleItem) return;
        scheduleItem.time = times;
      }));
    },
    clearAll: (usage:UIUsage) => {
      setState((prevState) => create(prevState, (draft) => {
        const usageItem = draft.usages.find((draftUsage) => draftUsage.uiID === usage.uiID);
        if (!usageItem) return;
        usageItem.schedules = Array(7).fill(null).map((_, i) => ({day_num: i, time: "", uiID: crypto.randomUUID(), object_on_usage_id: -1, object_id: -1, schedule_id: -1, from: 0, to: 0}));
      }));
    },
    changeInherit: (e:ChangeEvent<HTMLInputElement>, usage:UIUsage) => {
      setState((prevState) => create(prevState, (draft) => {
        const usageItem = draft.usages.find((draftUsage) => draftUsage.uiID === usage.uiID);
        if (!usageItem || !draft.parent) return;
        usageItem.schedule_inherit = e.target.checked;
        usageItem.schedules = draft.parent.usages[0]?.schedules.map((schedule) => ({...schedule, object_id: -1, object_on_usage_id: usage.object_on_usage_id}))
      }));
    },
    copyToAll: (schedule:ObjectSchedule, usage:UIUsage) => {
      setState((prevState) => create(prevState, (draft) => {
        const usageItem = draft.usages.find((draftUsage) => draftUsage.uiID === usage.uiID);
        if (!usageItem) return;
        usageItem.schedules = Array(7).fill(null).map((_, i) => ({day_num: i, time: schedule.time, uiID: crypto.randomUUID(), object_on_usage_id: -1, object_id: -1, schedule_id: -1, from: 0, to: 0}));
      }));
    },
  }

  return (
    <Card style={{marginBlockStart: "10px"}}>
      <Card.Heading>Использование</Card.Heading>
      {state.usages?.toSorted((a, b) => a.order - b.order).map((usage) => (
        <Card.Section key={usage.uiID}>
          <FieldSet style={{display: "flex", gap: "20px"}}>
            <FieldSet.Legend style={{inlineSize: "200px", marginInlineEnd: "auto"}}>
              <Button onClick={() => handleUsages.delete(usage)}>X</Button>
              <span>{usage?.name_public}</span>
            </FieldSet.Legend>
            <Checkbox
              name="schedule_inherit"
              checked={Boolean(usage.schedule_inherit)}
              onChange={(e) => handleSchedule.changeInherit(e, usage)}
              disabled={!state.parent_id}
              className="me-auto"
            >Наследовать расписание</Checkbox>
            <Button
              onClick={() => handleSchedule.clearAll(usage)}
              disabled={Boolean(usage.schedule_inherit)}
            >Очистить</Button>
          </FieldSet>
          <div style={{display: "flex", gap: "20px", marginBlockStart: "10px"}}>
            {state.type !== objectTypeEnum.org && (<>
              <Control>
                <Control.Label>Стоимость</Control.Label>
                <Control.Section>
                  <RadioGroup
                    valueToCompareWith={usage.cost ?? undefined}
                    onChange={(e) => handleUsages.cost(e, usage)}
                    required
                  >
                    <Radio value={costTypeEnum.paid}>Платно</Radio>
                    <Radio value={costTypeEnum.free}>Бесплатно</Radio>
                  </RadioGroup>
                </Control.Section>
              </Control>
            </>)}
            <div style={{display: "flex", flex: "1"}}>
              {Array(7).fill(null).map((localDay, i) => usage.schedules?.find((dbDay) => dbDay.day_num === i) ?? localDay).map((day, i) => (
                <div key={i} style={{display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1, flexBasis: 0}}>
                  <p >{["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"][i]}</p>
                  <Textarea name={String(i)} value={day?.time} onChange={(e) => handleSchedule.changeTime(e, usage)} onBlurIfChanged={(e) => handleSchedule.formatTime(e, usage)} disabled={Boolean(usage.schedule_inherit)} pattern="\d{1,2}:\d\d\s-\s\d{1,2}:\d\d" style={{inlineSize: "100%"}}/>
                  <Button onClick={(e) => handleSchedule.copyToAll(day, usage)} disabled={Boolean(usage.schedule_inherit)}>Copy</Button>
                </div>
              ))}
            </div>
          </div>
          <Textarea name="description" value={usage.description} onChange={(e) => handleUsages.description(e, usage)} maxLength="2000" style={{marginBlockStart: "15px"}} />
        </Card.Section>
      ))}
      <Card.Section>
        <Select
          isAutocomplete
          value=""
          onChangeData={handleUsages.add}
          placeholder="Добавить использование"
          requestItemsOnFirstTouch={async () =>
            (await getUsagesByFilters({sectionIds: state.sections.map((section) => section.section_id)}))
              .map((usage) => ({id: usage.usage_id, label: usage.name_service, data: usage}))
          }
        />
        {/* <RequiredInput isValidIf={Boolean(state.sections.filter((section) => section.section_type === sectionTypeEnum.usage).length > 0)}/> */}
      </Card.Section>
    </Card>
  )
}