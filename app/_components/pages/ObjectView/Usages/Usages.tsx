import { format } from "date-fns";
import { useContext } from "react";
import { objectTypeEnum } from "@/drizzle/schema";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
import { ObjectViewContext } from "../ObjectView";
import { PlaceSchedule, ClassSchedule } from "../";
// -----------------------------------------------------------------------------


export default function Usages() {
  const { state } = useContext(ObjectViewContext);

  return (
    <Card>
      <Card.Heading style={{display: "flex"}}>
        <p>
          <span>{state.type === objectTypeEnum.place ? "Использование" : "Расписание"}</span>
          {state.schedule_date ? <span>&nbsp;от {format(state.schedule_date, "dd.MM.yyyy")}&nbsp;</span> : null}
          {state.schedule_source ? <a href={`${state.schedule_source}`}>(Источник)</a> : null}
        </p>
      </Card.Heading>
      {state.usages.length ? state.usages.toSorted((a, b) => a.order - b.order).map((usage) => (
        <Card.Section key={usage.uiID}>
          {state.type === objectTypeEnum.place ? <p>{usage.name_public} ({usage.cost ? {paid: "Платно", free: "Бесплатно"}[usage.cost] : null})</p> : null}
          {state.type === objectTypeEnum.class ? (
            <p>
              <span>{"".concat(usage.sexMale ? "Мужчины" : "").concat(usage.sexMale && usage.sexFemale ? " / " : "").concat(usage.sexFemale ? "Женщины" : "")}</span>
              <span>, {usage.ageFrom} — {usage.ageTo} лет ({usage.cost ? {paid: "Платно", free: "Бесплатно"}[usage.cost] : null})</span>
            </p>
          ) : null}
          <p style={{marginBlockStart: "5px"}}>{usage.description}</p>
					{usage.schedules.filter((schedule) => schedule.time).length > 0 ? (
            state.type === objectTypeEnum.class ? <ClassSchedule usage={usage}/> : <PlaceSchedule usage={usage}/>
          ) : <p>Неизвестно</p>}
        </Card.Section>
      )) : (
        <Card.Section>Неизвестно</Card.Section>
      )}
    </Card>
  )
}