"use client";
import { create } from "mutative";
import { sectionTypeEnum } from "@/drizzle/schema";
import React, { type ChangeEvent, useContext } from "react";
import { format } from "date-fns";
// -----------------------------------------------------------------------------
import { SectionItem } from "../";
import { Card } from "@/app/_components/ui/Card";
import { ObjectEditContext } from "../ObjectEdit";
import { Select } from "@/app/_components/ui/Select";
import { Input, Textarea } from "@/app/_components/ui/Input";
// -----------------------------------------------------------------------------
import { getSectionsByFilters } from "@/app/_db/section";
import type { UIObjectUsage, UIScheduleDay, UISection } from "@/app/_types/types";
import { Checkbox } from "@/app/_components/ui/Choice";
import { Button } from "@/app/_components/ui/Button";
import { Control } from "@/app/_components/ui/Control";


export default function Usages() {
  const { state, setState, handleSections } = useContext(ObjectEditContext);

  const handleUsages = {
    add: (section:UISection) => {
      handleSections.add(section);
      if (!section.section_id || state.usages?.some((stateUsage) => stateUsage.section_id === section.section_id)) return;
      setState((prevState) => create(prevState, (draft) => {
        if (!draft.usages) draft.usages = [];
        draft.usages.push({object_id: -1, usage_id: section.section_id, section_id: section.section_id, description: ""});
      }))
    },
    delete: (section:UISection, usage:UIObjectUsage) => {
      handleSections.delete(section);
      setState((prevState) => create(prevState, (draft) => {
        draft.usages = draft.usages?.filter((draftUsage) => draftUsage.section_id !== section.section_id);
        draft.schedules = draft.schedules.filter((schedule) => schedule.usage_id !== usage.usage_id);
      }))
    },
    value: (e:ChangeEvent<HTMLInputElement>, usage:UIObjectUsage) => {
      setState((prevState) => create(prevState, (draft) => {
        const usageItem = draft.usages?.find((stateUsage) => stateUsage.usage_id === usage?.usage_id);
        if (!usageItem) return;
        usageItem[e.target.name as keyof typeof usageItem] = e.target.value as never
      }));
    },
    change24_7: (e:React.ChangeEvent<HTMLInputElement>, usage:UIObjectUsage) => {
      setState((prevState) => create(prevState, (draft) => {
        const usageItem = draft.usages?.find((stateUsage) => stateUsage.usage_id === usage?.usage_id);
        if (!usageItem) return;
        usageItem.schedule_24_7 = e.target.checked;
        if (e.target.checked) {
          draft.schedules = draft.schedules.filter((day) => day.usage_id !== usage.usage_id).concat(Array(7).fill(null).map((_, i) => ({object_id: -1, usage_id: usage.usage_id, day_num: i, isWork: true, time: "0:00 - 24:00", from: 0, to: 1440})));
        }
      }));
    },
    setInherit: (e:ChangeEvent<HTMLInputElement>, usage:UIObjectUsage) => {
      setState((prevState) => create(prevState, (draft) => {
        const usageItem = draft.usages?.find((stateUsage) => stateUsage.usage_id === usage?.usage_id);
        if (!usageItem) return;
        usageItem[e.target.name as keyof typeof usageItem] = e.target.checked as never;
        if (e.target.checked) {
          if (!draft.parent || !draft.parent.schedules || !draft.parent.usages?.length) return;
          draft.schedules = draft.schedules.filter((day) => day.usage_id !== usage.usage_id).concat(draft.parent?.schedules.map((parentUsage) => ({...parentUsage, usage_id: usage.usage_id, object_id: -1, isWork: true})));
          console.log( "test" )
          usageItem.schedule_24_7 = draft.parent.usages[0].schedule_24_7;
          usageItem.schedule_date = draft.parent.usages[0].schedule_date;
          usageItem.schedule_source = draft.parent.usages[0].schedule_source;
          usageItem.schedule_comment = draft.parent.usages[0].schedule_comment;
        }
      }));
    },
    setDate: (date:Date|null, usage:UIObjectUsage) => {
      setState((prevState) => create(prevState, (draft) => {
        const usageItem = draft.usages?.find((stateUsage) => stateUsage.usage_id === usage?.usage_id);
        if (!usageItem) return;
        usageItem.schedule_date = date;
      }));
    },
    clearAll: (usage:UIObjectUsage) => {
      setState((prevState) => create(prevState, (draft) => {
        const usageItem = draft.usages?.find((stateUsage) => stateUsage.usage_id === usage?.usage_id);
        if (!usageItem) return;
        usageItem.schedule_inherit = false;
        usageItem.schedule_24_7 = false;
        usageItem.schedule_date = null;
        usageItem.schedule_source = "";
        usageItem.schedule_comment = "";
        draft.schedules = draft.schedules.filter((day) => day.usage_id !== usage.usage_id);
      }));
    }
  }
  const handleSchedule = {
    changeIsWork: (e:React.ChangeEvent<HTMLInputElement>, usage:UIObjectUsage) => {
      const dayNum = Number(e.target.name);
      setState((prevState) => create(prevState, (draft) => {
        const scheduleDay = draft.schedules.find((day) => day.day_num === dayNum && day.usage_id === usage.usage_id);
        if (scheduleDay) {
          scheduleDay.isWork = e.target.checked;
          if (!e.target.checked) scheduleDay.time = "";
        } else {
          draft.schedules.push({object_id: -1, usage_id: usage.section_id, day_num: dayNum, time: "", from: 0, to: 0, isWork: true})
        }
      }))
    },
    changeTime: (e:React.ChangeEvent<HTMLInputElement>, usage:UIObjectUsage) => {
      setState((prevState) => create(prevState, (draft) => {
        const dayNum = Number(e.target.name);
        const scheduleDay = draft.schedules.find((day) => day.day_num === dayNum && day.usage_id === usage.usage_id);
        if (!scheduleDay) return;
        scheduleDay.time = e.target.value;
      }));
    },
    formatTime: (e:React.FocusEvent<HTMLInputElement>, usage:UIObjectUsage) => {
      if (!e.target.value) return;
      const dayNum = Number(e.target.name);
      const [from, to] = e.target.value.split("-").map((value) => {
        const matching = value.trim().match(/(\d+?)\s?[:.]?\s?(\d{2})?$/);
        if (!matching) return;
        const [_, hours, min] = matching;
        return {
          string: `${hours}:${min ?? "00"}`,
          min: Number(hours) * 60 + Number(min ?? 0)
        }
      });
      if (!from || !to) return;
      setState((prevState) => create(prevState, (draft) => {
        const scheduleDay = draft.schedules.find((day) => day.day_num === dayNum && day.usage_id === usage.usage_id);
        if (!scheduleDay) return;
        scheduleDay.time = [from.string, to.string].join(" - ");
        scheduleDay.from = from.min;
        scheduleDay.to = to.min;
      }));
    },
    copyToAll: (dayParam:UIScheduleDay, usage:UIObjectUsage) => {
      setState((prevState) => create(prevState, (draft) => {
        draft.schedules = draft.schedules.filter((day) => day.usage_id !== usage.usage_id).concat(Array(7).fill(null).map((_,i) => ({...dayParam, day_num: i})));
      }));
    },
  }

  return (
    <Card style={{marginBlockStart: "10px"}}>
      <Card.Heading>Использование</Card.Heading>
      <Card.Section style={{display: "flex", flexDirection: "column", gap: "20px"}}>
      {state.usages?.map((usage) => {
        const section = state.sections.find((section) => section.section_id === usage.section_id);
        const schedules = state.schedules?.filter((schedule) => schedule.usage_id === usage.usage_id);
        if (!section) return;
        return (
          <React.Fragment key={usage.section_id}>
            <SectionItem section={section} delFunc={(section) => handleUsages.delete(section, usage)}/>
            <Textarea name="description" value={usage.description} onChange={(e) => handleUsages.value(e, usage)} maxLength="2000" />
            <div style={{display: "flex", gap: "20px"}}>
              {state.parent_id && <Checkbox
                name="schedule_inherit"
                checked={Boolean(usage.schedule_inherit)}
                onChange={(e) => handleUsages.setInherit(e, usage)}
                disabled={!state.parent_id}
                className="me-auto"
              >Наследовать расписание</Checkbox>}
              <Checkbox
                name="schedule_24_7"
                checked={Boolean(usage.schedule_24_7)}
                onChange={(e) => handleUsages.change24_7(e, usage)}
                disabled={Boolean(usage.schedule_inherit)}
                style={{marginInlineStart: "auto"}}
              >Круглосуточно</Checkbox>
              <Button
                onClick={() => handleUsages.clearAll(usage)}
                disabled={Boolean(usage.schedule_inherit)}
              >Очистить</Button>
            </div>
            <div style={{display: "flex"}}>
              {Array(7).fill(null)
                .map((_,i) => ({ usage_id: usage.usage_id, schedule_id: -1, object_id: -1, day_num: i, time: "", from: 0, to: 0, uiID: crypto.randomUUID(), isWork: false }))
                .map((localDay) => schedules?.find((dbDay) => dbDay.day_num === localDay.day_num) ?? localDay)
                .map((day) => ({ ...day, uiID: crypto.randomUUID(),  }))
                .map((day, i) => (
                <p key={i} style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                  <Checkbox name={String(i)} checked={Boolean(day?.isWork)} onChange={(e) => handleSchedule.changeIsWork(e, usage)} tabIndex={-1} disabled={Boolean(usage.schedule_24_7 || usage.schedule_inherit)}>{["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"][i]}</Checkbox>
                  <Input name={String(i)} value={day?.isWork ? day?.time : "Не работает"} onChange={(e) => handleSchedule.changeTime(e, usage)} onBlurIfChanged={(e) => handleSchedule.formatTime(e, usage)} disabled={Boolean(!day?.isWork) || Boolean(usage.schedule_24_7) || Boolean(usage.schedule_inherit)}  pattern="\d{1,2}:\d\d\s-\s\d{1,2}:\d\d"/>
                  <Button onClick={(e) => handleSchedule.copyToAll(day, usage)} disabled={Boolean(!day?.isWork || usage.schedule_24_7 || usage.schedule_inherit)}>Copy</Button>
                </p>
              ))}
            </div>
            <div style={{display: "flex"}}>
              <Control>
                <Control.Label>Дата расписания</Control.Label>
                <Control.Section>
                  <input type="date" name="schedule_date" value={usage.schedule_date ? format(usage.schedule_date, "yyyy-MM-dd") : ""} onChange={(e) => handleUsages.setDate(new Date(e.target.value), usage)} disabled={Boolean(usage.schedule_inherit)}/>
                  <Button onClick={() => handleUsages.setDate(new Date(), usage)} disabled={Boolean(usage.schedule_inherit)}>Сегодня</Button>
                  <Button onClick={() => handleUsages.setDate(null, usage)} disabled={Boolean(usage.schedule_inherit)}>X</Button>
                </Control.Section>
              </Control>
              <Control>
                <Control.Label>Комментарий</Control.Label>
                <Control.Section>
                  <Input name="schedule_comment" value={usage.schedule_comment} onChange={(e) => handleUsages.value(e, usage)} disabled={Boolean(usage.schedule_inherit)}/>
                </Control.Section>
              </Control>
              <Control>
                <Control.Label>Источник</Control.Label>
                <Control.Section>
                  <Input name="schedule_source" value={usage.schedule_source} onChange={(e) => handleUsages.value(e, usage)} disabled={Boolean(usage.schedule_inherit)}/>
                </Control.Section>
              </Control>
            </div>
          </React.Fragment>
        )
      })}
      </Card.Section>
      <Card.Section>
        <Select
          isAutocomplete
          value=""
          onChangeData={handleUsages.add}
          placeholder="Добавить использование"
          requestItemsOnFirstTouch={async () =>
            (await getSectionsByFilters({objectType: state.type, sectionType: sectionTypeEnum.usage}))
              .map((section) => ({id: section.section_id, label: section.name_plural, data: section}))
          }
        />
      </Card.Section>
    </Card>
  )
}