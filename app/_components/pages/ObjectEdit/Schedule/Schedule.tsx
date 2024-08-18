import { create } from "mutative";
import { type ChangeEvent, useContext } from "react";
import type { UISchedule, UIUsage } from "@/app/_types/types";
// -----------------------------------------------------------------------------
import { ObjectEditContext } from "../ObjectEdit";
import { Button } from "@/app/_components/ui/Button";
import { Textarea } from "@/app/_components/ui/Input";
import { Textarea } from "@/app/_components/ui/Input";
import { Checkbox } from "@/app/_components/ui/Choice";
// -----------------------------------------------------------------------------


export default function Schedule(props:{usage:UIUsage}) {
  const { usage } = props;
  const { state, setState } = useContext(ObjectEditContext);

  const handleSchedule = {
    changeTime: (e:React.ChangeEvent<HTMLInputElement>) => {
      const dayNum = Number(e.target.name);
      setState((prevState) => create(prevState, (draft) => {
        if (e.target.checked) {
          draft.schedules = draft.schedules.concat({object_id: -1, usage_id: usage.usage_id, day_num: dayNum, uiID: crypto.randomUUID(), schedule_id: -1, order: 0, usage_name_id: usage.usage_name_id, time: "", from: 0, to: 0});
        } else {
          draft.schedules = draft.schedules.filter((schedule) => schedule.day_num !== dayNum);
        }
      }))
    },
    addTime: (dayNum:number, daySchedules:UISchedule[]) => {
      setState((prevState) => create(prevState, (draft) => {
        draft.schedules = draft.schedules.concat({object_id: -1, usage_id: usage.usage_id, day_num: dayNum, uiID: crypto.randomUUID(), schedule_id: -1, order: daySchedules.length, usage_name_id: usage.usage_name_id, time: "", from: 0, to: 0});
      }));
    },
    deleteTime: (schedule:UISchedule) => {
      setState((prevState) => create(prevState, (draft) => {
        draft.schedules = draft.schedules.filter((draftSchedule) => draftSchedule.uiID !== schedule.uiID);
      }));
    },
    changeTime: (e:React.ChangeEvent<HTMLInputElement>, schedule:UISchedule) => {
      setState((prevState) => create(prevState, (draft) => {
        const scheduleItem = draft.schedules.find((draftSchedule) => draftSchedule.uiID === schedule.uiID);
        if (!scheduleItem) return;
        scheduleItem.time = e.target.value;
      }));
    },
    formatTime: (e:React.FocusEvent<HTMLInputElement>, schedule:UISchedule) => {
      if (!e.target.value) return;
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
        const scheduleItem = draft.schedules.find((draftSchedule) => draftSchedule.uiID === schedule.uiID);
        if (!scheduleItem) return;
        scheduleItem.time = [from.string, to.string].join(" - ");
        scheduleItem.from = from.min;
        scheduleItem.to = to.min;
      }));
    },
    value: (e:ChangeEvent<HTMLInputElement>, usage:UIUsage) => {
      setState((prevState) => create(prevState, (draft) => {
        const usageItem = draft.usages.find((draftUsage) => draftUsage.uiID === usage.uiID);
        if (!usageItem) return;
        usageItem[e.target.name as keyof typeof usageItem] = e.target.value as never;
      }))
    },
    setDate: (date:Date|null) => {
      setState((prevState) => create(prevState, (draft) => {
        const usageItem = draft.usages.find((draftUsage) => draftUsage.usage_id === usage.usage_id);
        if (!usageItem) return;
        usageItem.schedule_date = date;
      }));
    },
    clearAll: () => {
      setState((prevState) => create(prevState, (draft) => {
        const usageItem = draft.usages.find((draftUsage) => draftUsage.uiID === usage.uiID);
        if (!usageItem) return;
        usageItem.schedules = Array(7).fill(null).map((_, i) => ({day_num: i, object_id: state.object_id, usage_id: usage.usage_id, object_usage_id: -1, schedule_id: -1, time: "", from: 0, to: 0}));
      }));
    },
    changeInherit: (e:ChangeEvent<HTMLInputElement>) => {
      setState((prevState) => create(prevState, (draft) => {
        const usageItem = draft.usages.find((draftUsage) => draftUsage.uiID === usage.uiID);
        if (!usageItem || !draft.parent) return;
        usageItem.schedule_inherit = e.target.checked;
        usageItem.schedule_24_7 = draft.parent.usages[0]?.schedule_24_7;
        usageItem.schedule_date = draft.parent.usages[0]?.schedule_date;
        usageItem.schedule_source = draft.parent.usages[0]?.schedule_source;
        usageItem.schedule_comment = draft.parent.usages[0]?.schedule_comment;
        draft.schedules = draft.parent?.schedules.map((schedule) => ({...schedule, object_id: -1, usage_id: usageItem.usage_id}));
      }));
    },
    copyToAll: (daySchedules:UISchedule[]) => {
      setState((prevState) => create(prevState, (draft) => {
        draft.schedules = draft.schedules.filter((schedule) => schedule.usage_id !== usage.usage_id).concat(Array(7).fill(null).flatMap((_, i) => daySchedules.map((schedule) => ({...schedule, day_num: i}))));
      }));
    },
  }

  return (<>
    <div style={{display: "flex", gap: "20px"}}>
      <Checkbox
        name="schedule_inherit"
        checked={Boolean(usage.schedule_inherit)}
        onChange={(e) => handleSchedule.changeInherit(e)}
        disabled={!state.parent_id}
        className="me-auto"
      >Наследовать расписание</Checkbox>
      <Button
        onClick={() => handleSchedule.clearAll()}
        disabled={Boolean(usage.schedule_inherit)}
      >Очистить</Button>
    </div>
    <div style={{display: "flex"}}>
      {Array(7).fill(null).map((_, i) => ({object_id: -1, usage_id: usage.usage_id, day_num: i})).map((day) => {
        const daySchedules = state.schedules.filter((schedule) => schedule.usage_id === usage.usage_id && schedule.day_num === day.day_num).toSorted((a, b) => a.order - b.order);
        return (
          <div key={day.day_num} style={{display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1, flexBasis: 0, border: "1px solid #eee"}}>
            <Checkbox name={String(day.day_num)} checked={Boolean(daySchedules.length)} onChange={(e) => handleSchedule.changeIsWork(e)} tabIndex={-1} disabled={Boolean(usage.schedule_24_7 || usage.schedule_inherit)} style={{alignSelf: "stretch", display: "flex", justifyContent: "center"}}>{["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"][day.day_num]}</Checkbox>
            {daySchedules.map((schedule, scheduleIndex) => (
              <p key={scheduleIndex} style={{display: "flex"}}>
                <Button onClick={() => handleSchedule.deleteTime(schedule)} disabled={Boolean(usage.schedule_24_7 || usage.schedule_inherit)}>X</Button>
                <Input name={String(schedule.day_num)} value={schedule.time} onChange={(e) => handleSchedule.changeTime(e, schedule)} onBlurIfChanged={(e) => handleSchedule.formatTime(e, schedule)} disabled={Boolean(!daySchedules.length) || Boolean(usage.schedule_24_7) || Boolean(usage.schedule_inherit)} pattern="\d{1,2}:\d\d\s-\s\d{1,2}:\d\d" style={{inlineSize: "100%"}}/>
              </p>
            ))}
            <p style={{display: "flex"}}>
              <Button onClick={() => handleSchedule.addTime(day.day_num, daySchedules)} disabled={Boolean(!daySchedules?.length || usage.schedule_24_7 || usage.schedule_inherit)}>+</Button>
              <Button onClick={(e) => handleSchedule.copyToAll(daySchedules)} disabled={Boolean(!daySchedules?.length || usage.schedule_24_7 || usage.schedule_inherit)}>Copy</Button>
            </p>
          </div>
        )
      })}
    </div>
    <div style={{display: "flex"}}>
      <Control>
        <Control.Label>Дата расписания</Control.Label>
        <Control.Section>
          <input type="date" name="schedule_date" value={usage.schedule_date ? format(usage.schedule_date, "yyyy-MM-dd") : ""} onChange={(e) => handleSchedule.setDate(new Date(e.target.value))} disabled={Boolean(usage.schedule_inherit)}/>
          <Button onClick={() => handleSchedule.setDate(new Date())} disabled={Boolean(usage.schedule_inherit)}>Сегодня</Button>
          <Button onClick={() => handleSchedule.setDate(null)} disabled={Boolean(usage.schedule_inherit)}>X</Button>
        </Control.Section>
      </Control>
      <Control>
        <Control.Label>Комментарий</Control.Label>
        <Control.Section>
          <Input name="schedule_comment" value={usage.schedule_comment} onChange={(e) => handleSchedule.value(e, usage)} disabled={Boolean(usage.schedule_inherit)}/>
        </Control.Section>
      </Control>
      <Control>
        <Control.Label>Источник</Control.Label>
        <Control.Section>
          <Input name="schedule_source" value={usage.schedule_source} onChange={(e) => handleSchedule.value(e, usage)} disabled={Boolean(usage.schedule_inherit)}/>
        </Control.Section>
      </Control>
    </div>
  </>)
}