"use client";
import type React from "react";
import { format } from "date-fns";
import { create } from "mutative";
import type { UIObjectUsage } from "@/app/_types/db";
import { type ChangeEvent, useContext } from "react";
import { costTypeEnum, type costTypeUnion, type ObjectSchedule, objectTypeEnum, sectionTypeEnum, type Usage } from "@/drizzle/schema";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
import { ObjectEditContext } from "../ObjectEdit";
import { Button } from "@/app/_components/ui/Button";
import { Control } from "@/app/_components/ui/Control";
import { FieldSet } from "@/app/_components/ui/FieldSet";
import { Input, Textarea } from "@/app/_components/ui/Input";
import { Select } from "@/app/_components/primitives/Select";
import { Checkbox, CheckboxGroup, Radio, RadioGroup } from "@/app/_components/ui/Choice";
// -----------------------------------------------------------------------------
import { getUsagesByFilters } from "@/app/_actions/db/usage";


export default function Usages() {
  const { state, setState } = useContext(ObjectEditContext);

  const handleUsages = {
    add: (usage:Usage) => {
      setState((prevState) => create(prevState, (draft) => {
        if (!draft.usages) draft.usages = [];
        draft.usages = draft.usages.concat({...usage, uiID: crypto.randomUUID(), schedules: [], object_id: null, description: "", object_on_usage_id: null, order: draft.usages.length, cost: null, schedule_inherit: null, sexMale: null, sexFemale: null, ageFrom: null, ageTo: null}).map((usage, i) => ({...usage, order: i, }));
      }))
    },
    delete: (usage:UIObjectUsage) => {
      setState((prevState) => create(prevState, (draft) => {
        draft.usages = draft.usages?.filter((draftUsage) => draftUsage.uiID !== usage.uiID).map((usage, i) => ({...usage, order: i}));
      }));
    },
    age: (e:ChangeEvent<HTMLInputElement>, usage:UIObjectUsage) => {
      setState((prevState) => create(prevState, (draft) => {
        const usageItem = draft.usages.find((draftUsage) => draftUsage.uiID === usage.uiID);
        if (!usageItem) return;
        usageItem[e.target.name as "ageFrom" | "ageTo"] = Number(e.target.value);
      }));
    },
    cost: (e:ChangeEvent<HTMLInputElement>, usage:UIObjectUsage) => {
      setState((prevState) => create(prevState, (draft) => {
        const usageItem = draft.usages.find((draftUsage) => draftUsage.uiID === usage.uiID);
        if (!usageItem) return;
        usageItem.cost = e.target.value as costTypeUnion;
      }));
    },
    sex: (e:ChangeEvent<HTMLInputElement>, usage:UIObjectUsage, fieldName:string) => {
      setState((prevState) => create(prevState, (draft) => {
        const usageItem = draft.usages.find((draftUsage) => draftUsage.uiID === usage.uiID);
        if (!usageItem) return;
        usageItem[fieldName as "sexMale" | "sexFemale"] = e.target.checked;
      }));
    },
    ageRange: (usage:UIObjectUsage, ageFrom:number, ageTo:number) => {
      setState((prevState) => create(prevState, (draft) => {
        const usageItem = draft.usages.find((draftUsage) => draftUsage.uiID === usage.uiID);
        if (!usageItem) return;
        usageItem.ageFrom = ageFrom;
        usageItem.ageTo = ageTo;
      }));
    },
    description: (e:ChangeEvent<HTMLInputElement>, usage:UIObjectUsage) => {
      setState((prevState) => create(prevState, (draft) => {
        const usageItem = draft.usages.find((draftUsage) => draftUsage.uiID === usage.uiID);
        if (!usageItem) return;
        usageItem.description = e.target.value;
      }));
    },
  }

  const handleSchedule = {
    changeTime: (e:React.ChangeEvent<HTMLInputElement>, usage:UIObjectUsage) => {
      const dayNum = Number(e.target.name);
      setState((prevState) => create(prevState, (draft) => {
        const usageItem = draft.usages.find((draftUsage) => draftUsage.uiID === usage.uiID);
        if (!usageItem) return;
        if (!usageItem.schedules) usage.schedules = [];
        const scheduleItem = usageItem?.schedules?.find((draftSchedule) => draftSchedule.day_num === dayNum);
        if (scheduleItem) {
          scheduleItem.time = e.target.value;
        } else {
          const newSchedule = {day_num: dayNum, time: e.target.value, uiID: crypto.randomUUID(), object_on_usage_id: null, object_id: null, schedule_id: null, from: 0, to: 0};
          usageItem.schedules = usageItem.schedules.concat(newSchedule)
        }
      }))
    },
    formatTime: (e:React.FocusEvent<HTMLInputElement>, usage:UIObjectUsage) => {
      const dayNum = Number(e.target.name);
      const times = e.target.value
        .trim()
        .split("\n")
        .map((time) => {
          const matching = time.trim().match(/(\d{1,2}):?(\d{2})?\s?-?\s?(\d{1,2})?:?(\d{2})?$/);
          if (!matching) return time;
          const [_, hoursFrom, minutesFrom, hoursTo, minutesTo] = matching;
          return `${hoursFrom}:${minutesFrom ?? "00"} - ${hoursTo ?? Number(hoursFrom) + 1}:${minutesTo ?? minutesFrom ?? "00"}`
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
    clearAll: (usage:UIObjectUsage) => {
      setState((prevState) => create(prevState, (draft) => {
        const usageItem = draft.usages.find((draftUsage) => draftUsage.uiID === usage.uiID);
        if (!usageItem) return;
        usageItem.schedules = Array(7).fill(null).map((_, i) => ({day_num: i, time: "", uiID: crypto.randomUUID(), object_on_usage_id: null, object_id: null, schedule_id: null, from: 0, to: 0}));
      }));
    },
    changeInherit: (e:ChangeEvent<HTMLInputElement>, usage:UIObjectUsage) => {
      setState((prevState) => create(prevState, (draft) => {
        const usageItem = draft.usages.find((draftUsage) => draftUsage.uiID === usage.uiID);
        if (!usageItem || !draft.parent) return;
        usageItem.schedule_inherit = e.target.checked;
        usageItem.schedules = draft.parent.usages[0]?.schedules.map((schedule) => ({...schedule, object_id: null, object_on_usage_id: usage.object_on_usage_id}))
      }));
    },
    copyToAll: (schedule:ObjectSchedule, usage:UIObjectUsage) => {
      setState((prevState) => create(prevState, (draft) => {
        const usageItem = draft.usages.find((draftUsage) => draftUsage.uiID === usage.uiID);
        if (!usageItem) return;
        usageItem.schedules = Array(7).fill(null).map((_, i) => ({day_num: i, time: schedule?.time ?? "", uiID: crypto.randomUUID(), object_on_usage_id: null, object_id: null, schedule_id: null, from: 0, to: 0}));
      }));
    },
  }

  const handleScheduleSource = {
    setDate: (date:Date|null) => {
      setState((prevState) => create(prevState, (draft) => {
        draft.schedule_date = date;
      }));
    },
    value: (e:ChangeEvent<HTMLInputElement>) => {
      setState((prevState) => create(prevState, (draft) => {
        draft[e.target.name as keyof typeof draft] = e.target.value as never;
      }))
    },
  }

  return (
    <Card style={{marginBlockStart: "10px"}}>
      <Card.Heading>Использование</Card.Heading>
      {state.usages?.toSorted((a, b) => a.order - b.order).map((usage) => (
        <Card.Section key={usage.uiID}>
          <FieldSet style={{display: "flex", gap: "20px"}}>
            <FieldSet.Legend style={{marginInlineEnd: "auto", display: "flex", alignItems: "center"}}>
              <Button onClick={() => handleUsages.delete(usage)}>X</Button>
              <Input value={usage.order} style={{inlineSize: "30px"}}/>
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
            {state.type !== objectTypeEnum.org && (
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
            )}
            {state.type === objectTypeEnum.class && (<>
              <Control>
                <Control.Label>Пол</Control.Label>
                <Control.Section style={{display: "flex", flexDirection: "column", gap: "5px"}}>
                  <CheckboxGroup required>
                    <Checkbox checked={Boolean(usage.sexMale)} onChange={(e) => handleUsages.sex(e, usage, "sexMale")}>Мужчины</Checkbox>
                    <Checkbox checked={Boolean(usage.sexFemale)} onChange={(e) => handleUsages.sex(e, usage, "sexFemale")}>Женщины</Checkbox>
                  </CheckboxGroup>
                </Control.Section>
              </Control>
              <Control>
                <Control.Label>Возраст</Control.Label>
                <Control.Section style={{display: "flex", gap: "5px"}}>
                  <Input type="number" style={{inlineSize: "50px"}} name="ageFrom" value={usage.ageFrom} onChange={(e) => handleUsages.age(e, usage)} required/>
                  <Input type="number" style={{inlineSize: "50px"}} name="ageTo" value={usage.ageTo} onChange={(e) => handleUsages.age(e, usage)} required/>
                  <Button onClick={() => handleUsages.ageRange(usage, 6, 15)}>Дети (6-15)</Button>
                  <Button onClick={() => handleUsages.ageRange(usage, 16, 100)}>Взрослые (16-100)</Button>
                  <Button onClick={() => handleUsages.ageRange(usage, 0, 100)}>Все (0-100)</Button>
                </Control.Section>
              </Control>
            </>)}
          </div>
          <div style={{display: "flex", flex: "1"}}>
            {Array(7).fill(null).map((localDay, i) => usage.schedules?.find((dbDay) => dbDay.day_num === i) ?? localDay).map((day, i) => (
              <div key={i} style={{display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1, flexBasis: 0}}>
                <p >{["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"][i]}</p>
                <Textarea name={String(i)} value={day?.time} onChange={(e) => handleSchedule.changeTime(e, usage)} onBlurIfChanged={(e) => handleSchedule.formatTime(e, usage)} disabled={Boolean(usage.schedule_inherit)} pattern="\d{1,2}:\d\d\s-\s\d{1,2}:\d\d" style={{inlineSize: "100%"}}/>
                <Button onClick={(e) => handleSchedule.copyToAll(day, usage)} disabled={Boolean(usage.schedule_inherit)} tabIndex={-1}>Copy</Button>
              </div>
            ))}
          </div>
          <Textarea name="description" value={usage.description} onChange={(e) => handleUsages.description(e, usage)} maxLength="2000" style={{marginBlockStart: "15px"}} />
        </Card.Section>
      ))}
      <Card.Section>
        <div style={{display: "flex"}}>
          <Control>
            <Control.Label>Дата расписания</Control.Label>
            <Control.Section>
              <input type="date" name="schedule_date" value={state.schedule_date ? format(state.schedule_date, "yyyy-MM-dd") : ""} onChange={(e) => handleScheduleSource.setDate(new Date(e.target.value))}/>
              <Button onClick={() => handleScheduleSource.setDate(new Date())}>Сегодня</Button>
              <Button onClick={() => handleScheduleSource.setDate(null)}>X</Button>
            </Control.Section>
          </Control>
          <Control>
            <Control.Label>Комментарий</Control.Label>
            <Control.Section>
              <Input name="schedule_comment" value={state.schedule_comment} onChange={(e) => handleScheduleSource.value(e)}/>
            </Control.Section>
          </Control>
          <Control>
            <Control.Label>Ссылка</Control.Label>
            <Control.Section>
              <Input name="schedule_source" value={state.schedule_source} onChange={(e) => handleScheduleSource.value(e)}/>
            </Control.Section>
          </Control>
        </div>
      </Card.Section>
      <Card.Section>
        <Select
          isAutocomplete
          value=""
          onChangeData={(data:Usage) => handleUsages.add(data)}
          placeholder="Добавить использование"
          requestItemsOnFirstTouch={async () => {
            if (state.sections.filter((section) => section.section_type !== sectionTypeEnum.common).length > 0) {
              return (await getUsagesByFilters({sectionIds: state.sections.map((section) => section.section_id)}))
              .map((usage) => ({id: String(usage.usage_id), label: usage.name_service, data: usage}))
            } else {
              return []
            }
          }}
        />
        {/* <RequiredInput isValidIf={Boolean(state.sections.filter((section) => section.section_type === sectionTypeEnum.usage).length > 0)}/> */}
      </Card.Section>
    </Card>
  )
}