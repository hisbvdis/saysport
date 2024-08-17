import { create } from "mutative";
import { closestTo, format } from "date-fns";
import { type ChangeEvent, useContext } from "react";
import type { UISchedule, UIUsage } from "@/app/_types/types";
// -----------------------------------------------------------------------------
import { ObjectEditContext } from "../ObjectEdit";
import { Input } from "@/app/_components/ui/Input";
import { Button } from "@/app/_components/ui/Button";
import { Checkbox } from "@/app/_components/ui/Choice";
import { Control } from "@/app/_components/ui/Control";
// -----------------------------------------------------------------------------


export default function Schedule(props:{usage:UIUsage}) {
  const { state, setState } = useContext(ObjectEditContext);

  const handleSchedule = {
    value: (e:ChangeEvent<HTMLInputElement>) => {
      setState((prevState) => create(prevState, (draft) => {
        const usage = draft.usages.find((draftUsage) => draftUsage.usage_id === props.usage.usage_id);
        if (!usage) return;
        usage[e.target.name as keyof typeof usage] = e.target.value as never;
      }))
    },
    changeIsWork: (e:React.ChangeEvent<HTMLInputElement>) => {
      const dayNum = Number(e.target.name);
      setState((prevState) => create(prevState, (draft) => {
        const schedule = draft.schedules?.find((draftSchedule) => draftSchedule.usage_id === props.usage.usage_id && draftSchedule.day_num === dayNum);
        if (schedule) {
          schedule.isWork = e.target.checked;
          if (!e.target.checked) draft.schedules = draft.schedules.filter((draftSchedule) => draftSchedule.usage_id !== schedule.usage_id || (draftSchedule.usage_id === schedule.usage_id && draftSchedule.day_num !== schedule.day_num));
        } else {
          draft.schedules.push({object_id: -1, usage_id: props.usage.usage_id ?? -1, day_num: dayNum, time: "", from: 0, to: 0, isWork: true, times: [""], froms: [], tos: [], order: 0})
        }
      }))
    },
    changeTime: (e:React.ChangeEvent<HTMLInputElement>, inputNum:number) => {
      const dayNum = Number(e.target.name);
      setState((prevState) => create(prevState, (draft) => {
        const schedule = draft.schedules.find((draftSchedule) => draftSchedule.usage_id === props.usage.usage_id && draftSchedule.day_num === dayNum);
        if (!schedule) return;
        schedule.times[inputNum] = e.target.value;
      }));
    },
    formatTime: (e:React.FocusEvent<HTMLInputElement>, inputNum:number) => {
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
        const schedule = draft.schedules.find((draftSchedule) => draftSchedule.usage_id === props.usage.usage_id && draftSchedule.day_num === dayNum);
        if (!schedule) return;
        schedule.times[inputNum] = [from.string, to.string].join(" - ");
        schedule.froms[inputNum] = from.min;
        schedule.tos[inputNum] = to.min;
      }));
    },
    addDayTime: (dayNum:number) => {
      setState((prevState) => create(prevState, (draft) => {
        const schedule = draft.schedules.find((draftSchedule) => draftSchedule.usage_id === props.usage.usage_id && draftSchedule.day_num === dayNum);
        if (!schedule) return;
        schedule.times = schedule.times.concat("");
      }));
    },
    deleteDayTime: (dayNum:number, inputNum:number) => {
      setState((prevState) => create(prevState, (draft) => {
        const schedule = draft.schedules.find((draftSchedule) => draftSchedule.usage_id === props.usage.usage_id && draftSchedule.day_num === dayNum);
        if (!schedule) return;
        if (schedule.times.length > 1) {
          schedule.times = schedule.times.filter((_, i) => i !== inputNum);
          schedule.froms = schedule.froms.filter((_, i) => i !== inputNum);
          schedule.tos = schedule.tos.filter((_, i) => i !== inputNum);
        } else {
          schedule.times = [""];
          schedule.froms = [0];
          schedule.tos = [0];
        }
      }));
    },
    changeInherit: (e:ChangeEvent<HTMLInputElement>) => {
      setState((prevState) => create(prevState, (draft) => {
        const usage = draft.usages.find((draftUsage) => draftUsage.usage_id === props.usage.usage_id);
        if (!usage || !draft.parent) return;
        usage.schedule_inherit = e.target.checked;
        usage.schedule_24_7 = draft.parent.usages[0].schedule_24_7;
        usage.schedule_date = draft.parent.usages[0].schedule_date;
        usage.schedule_source = draft.parent.usages[0].schedule_source;
        usage.schedule_comment = draft.parent.usages[0].schedule_comment;
        draft.schedules = draft.parent?.schedules.map((schedule) => ({...schedule, object_id: -1, usage_id: usage.usage_id, isWork: Boolean(schedule.times.length)}));
      }));
    },
    change24_7: (e:React.ChangeEvent<HTMLInputElement>) => {
      setState((prevState) => create(prevState, (draft) => {
        const usage = draft.usages.find((draftUsage) => draftUsage.usage_id === props.usage.usage_id);
        if (!usage) return;
        usage.schedule_24_7 = e.target.checked;
        if (e.target.checked) {
          draft.schedules = draft.schedules.filter((schedule) => schedule.usage_id !== props.usage.usage_id).concat(Array(7).fill(null).map((_, i) => ({object_id: -1, day_num: i, usage_id: props.usage.usage_id, isWork: true, time: "", from: 0, to: 1440, times: ["0:00 - 24:00"], froms: [0], tos: [1440], order: i})))
        }
      }));
    },
    clearAll: () => {
      setState((prevState) => create(prevState, (draft) => {
        const usage = draft.usages.find((draftUsage) => draftUsage.usage_id === props.usage.usage_id);
        if (!usage) return;
        usage.schedule_inherit = false;
        usage.schedule_24_7 = false;
        usage.schedule_date = null;
        usage.schedule_source = "";
        usage.schedule_comment = "";
        draft.schedules = draft.schedules.filter((schedule) => schedule.usage_id !== props.usage.usage_id);
      }));
    },
    copyToAll: (dayParam:UISchedule) => {
      setState((prevState) => create(prevState, (draft) => {
        const usage = draft.usages.find((draftUsage) => draftUsage.usage_id === props.usage.usage_id);
        if (!usage) return;
        draft.schedules = Array(7).fill(null).map((_,i) => ({...dayParam, day_num: i}));
      }));
    },
    setDate: (date:Date|null) => {
      setState((prevState) => create(prevState, (draft) => {
        const usage = draft.usages.find((draftUsage) => draftUsage.usage_id === props.usage.usage_id);
        if (!usage) return;
        usage.schedule_date = date;
      }));
    },
  }

  return (<>
    <div style={{display: "flex", gap: "20px"}}>
      <Checkbox
        name="schedule_inherit"
        checked={Boolean(props.usage.schedule_inherit)}
        onChange={(e) => handleSchedule.changeInherit(e)}
        disabled={!state.parent_id}
        className="me-auto"
      >Наследовать расписание</Checkbox>
      <Checkbox
        name="schedule_24_7"
        checked={Boolean(props.usage.schedule_24_7)}
        onChange={(e) => handleSchedule.change24_7(e)}
        disabled={Boolean(props.usage.schedule_inherit)}
        style={{marginInlineStart: "auto"}}
      >Круглосуточно</Checkbox>
      <Button
        onClick={() => handleSchedule.clearAll()}
        disabled={Boolean(props.usage.schedule_inherit)}
      >Очистить</Button>
    </div>
    <div style={{display: "flex"}}>
      {Array(7).fill(null)
        .map((_,i) => ({ object_id: -1, usage_id: props.usage.usage_id, schedule_id: -1, day_num: i, time: "", from: 0, to: 0, uiID: crypto.randomUUID(), isWork: false, times: [], froms: [], tos: [], order: i }) as UISchedule)
        .map((localDay) => state.schedules.find((dbDay) => dbDay.usage_id === props.usage.usage_id && dbDay.day_num === localDay.day_num) ?? localDay)
        .map((day) => ({...day, isWork: Boolean(day.times.length)}))
        .map((day, i) => (
        <div key={i} style={{display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1, flexBasis: 0, border: "1px solid #eee"}}>
          <Checkbox name={String(i)} checked={Boolean(day?.isWork)} onChange={(e) => handleSchedule.changeIsWork(e)} tabIndex={-1} disabled={Boolean(props.usage.schedule_24_7 || props.usage.schedule_inherit)} style={{alignSelf: "stretch", display: "flex", justifyContent: "center"}}>{["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"][i]}</Checkbox>
          {day.times?.map((time, i) => (
            <p key={i} style={{display: "flex"}}>
              <Button onClick={(e) => handleSchedule.deleteDayTime(day.day_num, i)} disabled={Boolean(props.usage.schedule_24_7 || props.usage.schedule_inherit)}>X</Button>
              <Input name={String(day.day_num)} value={day?.isWork ? time : "Не работает"} onChange={(e) => handleSchedule.changeTime(e, i)} onBlurIfChanged={(e) => handleSchedule.formatTime(e, i)} disabled={Boolean(!day?.isWork) || Boolean(props.usage.schedule_24_7) || Boolean(props.usage.schedule_inherit)} pattern="\d{1,2}:\d\d\s-\s\d{1,2}:\d\d" style={{inlineSize: "100%"}}/>
            </p>
          ))}
          <p style={{display: "flex"}}>
            <Button onClick={() => handleSchedule.addDayTime(day.day_num)} disabled={Boolean(!day?.isWork || props.usage.schedule_24_7 || props.usage.schedule_inherit)}>+</Button>
            <Button onClick={(e) => handleSchedule.copyToAll(day)} disabled={Boolean(!day?.isWork || props.usage.schedule_24_7 || props.usage.schedule_inherit)}>Copy</Button>
          </p>
        </div>
      ))}
    </div>
    <div style={{display: "flex"}}>
      <Control>
        <Control.Label>Дата расписания</Control.Label>
        <Control.Section>
          <input type="date" name="schedule_date" value={props.usage.schedule_date ? format(props.usage.schedule_date, "yyyy-MM-dd") : ""} onChange={(e) => handleSchedule.setDate(new Date(e.target.value))} disabled={Boolean(props.usage.schedule_inherit)}/>
          <Button onClick={() => handleSchedule.setDate(new Date())} disabled={Boolean(props.usage.schedule_inherit)}>Сегодня</Button>
          <Button onClick={() => handleSchedule.setDate(null)} disabled={Boolean(props.usage.schedule_inherit)}>X</Button>
        </Control.Section>
      </Control>
      <Control>
        <Control.Label>Комментарий</Control.Label>
        <Control.Section>
          <Input name="schedule_comment" value={props.usage.schedule_comment} onChange={(e) => handleSchedule.value(e)} disabled={Boolean(props.usage.schedule_inherit)}/>
        </Control.Section>
      </Control>
      <Control>
        <Control.Label>Источник</Control.Label>
        <Control.Section>
          <Input name="schedule_source" value={props.usage.schedule_source} onChange={(e) => handleSchedule.value(e)} disabled={Boolean(props.usage.schedule_inherit)}/>
        </Control.Section>
      </Control>
    </div>
  </>)
}