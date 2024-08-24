import { useContext } from "react";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
import { ObjectViewContext } from "../ObjectView";
import { objectTypeEnum } from "@/drizzle/schema";


export default function Usages() {
  const { state } = useContext(ObjectViewContext);

  return (
    <Card>
      <Card.Heading>{state.type === objectTypeEnum.place ? "Использование" : "Занятия"}</Card.Heading>
      {state.usages.toSorted((a, b) => a.order - b.order).map((usage) => (
        <Card.Section key={usage.uiID}>
          <p>{usage.name_public}</p>
          <div style={{marginBlockStart: "5px"}}>
            {usage.cost ? <p>
              <span style={{color: "#808080"}}>Стоимость:</span>
              <span>{{paid: "Платно", free: "Бесплатно"}[usage.cost]}</span>
            </p> : null}
            <p style={{marginBlockStart: "5px"}}>{usage.description}</p>
          </div>
          {usage.schedules.filter((schedule) => schedule.time).length > 0 ? (
            <div style={{marginBlockStart: "5px"}}>
              {usage.schedules.every((schedule, _, arr) => schedule.time === arr[0].time) ? (
                <p style={{marginBlockStart: "5px"}}>Ежедневно: {usage.schedules[0].time.split("\n").join(", ")}</p>
              ) : (
                <table style={{marginBlockStart: "5px", inlineSize: "100%", borderCollapse: "collapse"}}>
                  <tbody>
                    <tr>
                      {usage.schedules.filter((schedule) => schedule?.time).map((day, i) => (
                        <td key={i} style={{textAlign: "center", fontSize: "0.9em", border: "1px solid #eee", backgroundColor: "#fafafa"}}>{["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"][day.day_num]}</td>
                      ))}
                    </tr>
                    <tr>
                      {usage.schedules.filter((schedule) => schedule?.time).map((localDay, i) => usage.schedules.find((schedule) => schedule.day_num === localDay.day_num) ?? localDay).map((day, i) => (
                        <td key={i} style={{whiteSpace: "pre-wrap", textAlign: "center", fontSize: "0.8em", border: "1px solid #eee"}}>{day?.time}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          ) : null}
        </Card.Section>
      ))}
    </Card>
  )
}