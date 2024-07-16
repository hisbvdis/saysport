"use client";
import { create } from "mutative";
import { useContext } from "react";
import { format } from "date-fns";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
import { Input } from "@/app/_components/ui/Input";
import { Button } from "@/app/_components/ui/Button";
import { Control } from "@/app/_components/ui/Control";
import { Checkbox } from "@/app/_components/ui/Choice";
// -----------------------------------------------------------------------------
import type { UIObject } from "@/app/_types/types";
import { ObjectEditContext } from "../ObjectEdit";


export default function Schedule() {
  const { state, setState, handleStateChange } = useContext(ObjectEditContext);

  const handleSchedule = {
    changeIsWork: (e:React.ChangeEvent<HTMLInputElement>) => {
      const dayNum = Number(e.target.name);
      setState((prevState) => create(prevState, (draft) => {
        draft.schedule[dayNum].isWork = e.target.checked;
        if (!e.target.checked) draft.schedule[dayNum].time = "";
      }))
    },
    changeTime: (e:React.ChangeEvent<HTMLInputElement>) => {
      setState((prevState) => create(prevState, (draft) => {
        const targetName = Number(e.target.name);
        draft.schedule[targetName].time = e.target.value;
      }));
    },
    formatTime: (e:React.FocusEvent<HTMLInputElement>) => {
      if (!e.target.value) return;
      const targetName = Number(e.target.name);
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
        draft.schedule[targetName].time = [from.string, to.string].join(" - ");
        draft.schedule[targetName].from = from.min;
        draft.schedule[targetName].to = to.min;
      }));
    },
    copyToAll: (dayParam:UIObject["schedule"][number]) => {
      setState((prevState) => create(prevState, (draft) => {
        draft.schedule = draft.schedule.map((day) => ({...day, isWork: dayParam.isWork, time: dayParam.time, from: dayParam.from, to: dayParam.to}));
      }));
    },
    change24_7: (e:React.ChangeEvent<HTMLInputElement>) => {
      setState((prevState) => create(prevState, (draft) => {
        draft.schedule_24_7 = e.target.checked;
        if (e.target.checked) {
          draft.schedule = draft.schedule.map((day) => ({...day, isWork: true, time: "0:00 - 24:00", from: 0, to: 1440}));
        }
      }));
    },
    setDate: (date:Date|string) => {
      setState((prevState) => create(prevState, (draft) => {
        if (typeof date === "string") {
          draft.schedule_date = null;
        } else {
          draft.schedule_date = date;
        }
      }));
    },
    clearAll: () => {
      setState((prevState) => create(prevState, (draft) => {
        draft.schedule_inherit = false;
        draft.schedule_24_7 = false;
        draft.schedule = Array(7).fill(null).map((_,i) => ({ schedule_id: -1, object_id: -1, day_num: i, time: "", from: 0, to: 0, uiID: crypto.randomUUID(), isWork: false }));
        draft.schedule_date = null;
        draft.schedule_source = "";
        draft.schedule_comment = "";
      }));
    }
  }

  return (
    <Card style={{marginBlockStart: "10px"}}>
      <Card.Heading>Расписание</Card.Heading>
      <Card.Section style={{display: "flex", flexDirection: "column", gap: "10px"}}>
        <div style={{display: "flex", gap: "20px"}}>
          <Checkbox
            name="schedule_inherit"
            checked={Boolean(state.schedule_inherit)}
            onChange={handleStateChange.checked}
            disabled={!state.parent_id}
            className="me-auto"
          >Наследовать расписание</Checkbox>
          <Checkbox
            name="schedule_24_7"
            checked={Boolean(state.schedule_24_7)}
            onChange={handleSchedule.change24_7}
            disabled={Boolean(state.schedule_inherit)}
            style={{marginInlineStart: "auto"}}
          >Круглосуточно</Checkbox>
          <Button
            onClick={handleSchedule.clearAll}
            disabled={Boolean(state.schedule_inherit)}
          >Очистить</Button>
        </div>
        <div style={{display: "flex"}}>
          {state.schedule?.map((day, i) => (
            <p key={i} style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
              <Checkbox name={String(i)} checked={Boolean(day?.isWork)} onChange={handleSchedule.changeIsWork} tabIndex={-1} disabled={Boolean(state.schedule_24_7 || state.schedule_inherit)}>{["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"][i]}</Checkbox>
              <Input name={String(i)} value={day?.isWork ? day?.time : "Не работает"} onChange={handleSchedule.changeTime} onBlurIfChanged={handleSchedule.formatTime} disabled={Boolean(!day?.isWork) || Boolean(state.schedule_24_7) || Boolean(state.schedule_inherit)}  pattern="\d{1,2}:\d\d\s-\s\d{1,2}:\d\d"/>
              <Button onClick={() => handleSchedule.copyToAll(day)} disabled={Boolean(!day?.isWork || state.schedule_24_7 || state.schedule_inherit)}>Copy</Button>
            </p>
          ))}
        </div>
        <div style={{display: "flex"}}>
          <Control>
            <Control.Label>Дата расписания</Control.Label>
            <Control.Section>
              <input type="date" name="schedule_date" value={state.schedule_date ? format(state.schedule_date, "yyyy-MM-dd") : ""} onChange={handleStateChange.value} disabled={Boolean(state.schedule_inherit)}/>
              <Button onClick={() => handleSchedule.setDate(new Date())} disabled={Boolean(state.schedule_inherit)}>Сегодня</Button>
              <Button onClick={() => handleSchedule.setDate("")} disabled={Boolean(state.schedule_inherit)}>X</Button>
            </Control.Section>
          </Control>
          <Control>
            <Control.Label>Комментарий</Control.Label>
            <Control.Section>
              <Input name="schedule_comment" value={state.schedule_comment} onChange={handleStateChange.value} disabled={Boolean(state.schedule_inherit)}/>
            </Control.Section>
          </Control>
          <Control>
            <Control.Label>Источник</Control.Label>
            <Control.Section>
              <Input name="schedule_source" value={state.schedule_source} onChange={handleStateChange.value} disabled={Boolean(state.schedule_inherit)}/>
            </Control.Section>
          </Control>
        </div>
      </Card.Section>
    </Card>
  )
}