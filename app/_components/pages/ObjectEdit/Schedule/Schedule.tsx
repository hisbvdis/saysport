import { create } from "mutative";
import { type ChangeEvent, useContext } from "react";
import type { UISchedule, UIUsage } from "@/app/_types/types";
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
        const scheduleItem = draft.schedules.find((draftSchedule) => draftSchedule.usage_id === usage.usage_id && draftSchedule.day_num === dayNum);
        if (!scheduleItem) return;
        scheduleItem.time = e.target.value;
      }));
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
        const scheduleItem = draft.schedules.find((draftSchedule) => draftSchedule.usage_id === usage.usage_id && draftSchedule.day_num === dayNum);
        if (!scheduleItem) return;
        scheduleItem.time = times;
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
      {Array(7).fill(null)
        .map((_,i) => ({ object_usage_id: usage.object_usage_id, usage_id: usage.usage_id, day_num: i, time: "" }))
        .map((localSchedule) => state.schedules?.filter((dbSchedule) => localSchedule.usage_id === dbSchedule.usage_id)
        .find((dbSchedule) => dbSchedule.day_num === localSchedule.day_num) ?? localSchedule)
        // .map((localDay) => state.schedules?.find((dbDay) => dbDay.day_num === localDay.day_num) ?? localDay)
        .map((day, i) => (
          <div key={i} style={{display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1, flexBasis: 0, border: "1px solid #eee"}}>
            <p>{["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"][i]}</p>
            <Textarea name={String(i)} value={day?.time} onChange={(e) => handleSchedule.changeTime(e)} onBlurIfChanged={(e) => handleSchedule.formatTime(e)} pattern="\d{1,2}:\d\d\s-\s\d{1,2}:\d\d" style={{inlineSize: "100%"}}/>
          </div>
        ))
      }
    </div>
  </>)
}