import { create } from "mutative";
import type { UISchedule, UIUsage } from "@/app/_types/types";
import { type ChangeEvent, useContext } from "react";
import type { ObjectSchedule } from "@/drizzle/schema";
// -----------------------------------------------------------------------------
import { ObjectEditContext } from "../ObjectEdit";
import { Button } from "@/app/_components/ui/Button";
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
        const usageItem = draft.usages.find((draftUsage) => draftUsage.uiID === usage.uiID);
        if (!usageItem) return;
        if (!usageItem.schedules) usage.schedules = [];
        const scheduleItem = usageItem?.schedules?.find((draftSchedule) => draftSchedule.day_num === dayNum);
        if (scheduleItem) {
          scheduleItem.time = e.target.value;
        } else {
          usageItem.schedules = usageItem?.schedules?.concat({day_num: dayNum, time: e.target.value, uiID: crypto.randomUUID(), object_usage_id: -1, object_id: -1, schedule_id: -1, from: 0, to: 0})
        }
      }))
    },
    formatTime: (e:React.FocusEvent<HTMLInputElement>) => {
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
    clearAll: () => {
      setState((prevState) => create(prevState, (draft) => {
        const usageItem = draft.usages.find((draftUsage) => draftUsage.uiID === usage.uiID);
        if (!usageItem) return;
        usageItem.schedules = [];
      }));
    },
    changeInherit: (e:ChangeEvent<HTMLInputElement>) => {
      setState((prevState) => create(prevState, (draft) => {
        const usageItem = draft.usages.find((draftUsage) => draftUsage.uiID === usage.uiID);
        if (!usageItem || !draft.parent) return;
        usageItem.schedule_inherit = e.target.checked;
        usageItem.schedules = draft.parent.usages[0].schedules.map((schedule) => ({...schedule, object_id: -1, object_usage_id: usage.object_usage_id}))
      }));
    },
    copyToAll: (schedule:ObjectSchedule) => {
      setState((prevState) => create(prevState, (draft) => {
        const usageItem = draft.usages.find((draftUsage) => draftUsage.uiID === usage.uiID);
        if (!usageItem) return;
        usageItem.schedules = Array(7).fill(null).map((_, i) => ({day_num: i, time: schedule.time, uiID: crypto.randomUUID(), object_usage_id: -1, object_id: -1, schedule_id: -1, from: 0, to: 0}));
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
      {Array(7).fill(null).map((localDay, i) => usage.schedules?.find((dbDay) => dbDay.day_num === i) ?? localDay).map((day, i) => (
        <div key={i} style={{display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1, flexBasis: 0, border: "1px solid #eee"}}>
          <p >{["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"][i]}</p>
          <Textarea name={String(i)} value={day?.time} onChange={(e) => handleSchedule.changeTime(e)} onBlurIfChanged={(e) => handleSchedule.formatTime(e)} disabled={Boolean(usage.schedule_inherit)} pattern="\d{1,2}:\d\d\s-\s\d{1,2}:\d\d" style={{inlineSize: "100%"}}/>
          <Button onClick={(e) => handleSchedule.copyToAll(day)} disabled={Boolean(usage.schedule_inherit)}>Copy</Button>
        </div>
      ))}
    </div>
  </>)
}