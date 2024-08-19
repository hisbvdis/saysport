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

  const usageSchedules = state.schedules
    .filter((schedule) => schedule.usageUIID === usage.uiID)
    .reduce((accum, schedule) => {
      let newAccum = structuredClone(accum);
      const accumDay = newAccum.find((day) => day.day_num === schedule.day_num);
      if (accumDay) {
        accumDay.time = `${accumDay.time}\n${schedule.time}`;
      } else {
        newAccum = [...newAccum, {...schedule, usageUIID: usage.uiID}];
      }
      return newAccum;
    }, [] as UISchedule[])

  const handleSchedule = {
    changeTime: (e:React.ChangeEvent<HTMLInputElement>) => {
      const dayNum = Number(e.target.name);
      setState((prevState) => create(prevState, (draft) => {
        draft.schedules = draft.schedules
          .filter((schedule) => schedule.usageUIID !== usage.uiID || (schedule.usageUIID === usage.uiID && schedule.day_num !== dayNum))
          .concat(e.target.value.split("\n").map((time) => ({usage_id: usage.usage_id, object_usage_id: usage.object_usage_id, day_num: dayNum, uiID: crypto.randomUUID(), object_id: state.object_id ?? -1, schedule_id: -1, time: time, from: 0, to: 0, usageUIID: usage.uiID})));
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
        draft.schedules = draft.schedules
          .filter((schedule) => schedule.usageUIID !== usage.uiID || (schedule.usageUIID === usage.uiID && schedule.day_num !== dayNum))
          .concat(times.split("\n").map((time) => ({usage_id: usage.usage_id, object_usage_id: usage.object_usage_id, day_num: dayNum, uiID: crypto.randomUUID(), object_id: state.object_id ?? -1, schedule_id: -1, time: time, from: 0, to: 0, usageUIID: usage.uiID})));
      }));
    },
    clearAll: () => {
      setState((prevState) => create(prevState, (draft) => {
        draft.schedules = draft.schedules
          .filter((schedule) => schedule.usageUIID !== usage.uiID)
          .concat((Array(7).fill(null).map((_, i) => ({object_id: usage.object_id, object_usage_id: usage.object_usage_id, usage_id: usage.usage_id, day_num: i, schedule_id: -1, time: "", from: 0, to: 0, usageUIID: usage.uiID, uiID: crypto.randomUUID()}))))
      }));
    },
    changeInherit: (e:ChangeEvent<HTMLInputElement>) => {
      setState((prevState) => create(prevState, (draft) => {
        const usageItem = draft.usages.find((draftUsage) => draftUsage.uiID === usage.uiID);
        if (!usageItem || !draft.parent) return;
        usageItem.schedule_inherit = e.target.checked;
        draft.schedules = draft.parent.schedules
          .filter((schedule) => schedule.usageUIID !== usage.uiID)
          .concat((draft.parent.schedules.map((schedule) => ({...schedule, object_id: -1, object_usage_id: usage.object_usage_id}))))
      }));
    },
    copyToAll: (schedule:ObjectSchedule) => {
      setState((prevState) => create(prevState, (draft) => {
        draft.schedules = draft.schedules
          .filter((schedule) => schedule.usageUIID !== usage.uiID)
          .concat(Array(7).fill(null).map((_, i) => ({...schedule, day_num: i, uiID: crypto.randomUUID(), usageUIID: usage.uiID})))
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
      {Array(7).fill(null)
        .map((localDay, i) => usageSchedules?.find((dbDay) => dbDay.day_num === i) ?? localDay).map((day, i) => (
        <div key={i} style={{display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1, flexBasis: 0, border: "1px solid #eee"}}>
          <p >{["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"][i]}</p>
          <Textarea name={String(i)} value={day?.time} onChange={(e) => handleSchedule.changeTime(e)} onBlurIfChanged={(e) => handleSchedule.formatTime(e)} pattern="\d{1,2}:\d\d\s-\s\d{1,2}:\d\d" style={{inlineSize: "100%"}}/>
          <Button onClick={(e) => handleSchedule.copyToAll(day)} disabled={Boolean(usage.schedule_inherit)}>Copy</Button>
        </div>
      ))}
    </div>
  </>)
}