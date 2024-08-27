import { useContext } from "react";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
import { ObjectViewContext } from "../ObjectView";
import { objectTypeEnum } from "@/drizzle/schema";


export default function Usages() {
  const { state } = useContext(ObjectViewContext);

  return (
    <Card>
      <Card.Heading>{state.type === objectTypeEnum.place ? "Использование" : "Групповые занятия"}</Card.Heading>
      {state.usages.toSorted((a, b) => a.order - b.order).map((usage) => (
        <Card.Section key={usage.uiID}>
          {state.type !== objectTypeEnum.class ? <p>{usage.name_public}</p> : null}
          {state.type === objectTypeEnum.class ? (
            <p>
              <span>{"".concat(usage.sexMale ? "Мужчины" : "").concat(usage.sexMale && usage.sexFemale ? ", " : "").concat(usage.sexFemale ? "Женщины" : "")}</span>
              <span> от {usage.ageFrom} {usage.ageTo === 100 ? "" : `до ${usage.ageTo}`} лет ({usage.cost ? {paid: "Платно", free: "Бесплатно"}[usage.cost] : null})</span>
            </p>
          ) : null}
          <p style={{marginBlockStart: "5px"}}>{usage.description}</p>
          {usage.schedules.filter((schedule) => schedule.time).length > 0 ? (
            <div style={{marginBlockStart: "5px"}}>
              <table style={{marginBlockStart: "10px", inlineSize: "100%", borderCollapse: "collapse"}}>
                <tbody>
                  <tr>
                    {usage.schedules.map((day, i) => (
                      <td key={i} style={{textAlign: "center", fontSize: "0.9em", border: "1px solid #eee", backgroundColor: "#fafafa", inlineSize: "calc(100% / 7)"}}>{["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"][day.day_num]}</td>
                    ))}
                  </tr>
                  <tr>
                    {usage.schedules.map((localDay, i) => usage.schedules.find((schedule) => schedule.day_num === localDay.day_num) ?? localDay).map((day, i) => (
                      <td key={i} style={{verticalAlign: "top", whiteSpace: "pre-wrap", textAlign: "center", fontSize: "0.8em", border: "1px solid #eee", inlineSize: "calc(100% / 7)"}}>{day?.time}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          ) : null}
        </Card.Section>
      ))}
    </Card>
  )
}