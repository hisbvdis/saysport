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
        <Card.Section key={usage.usage_id}>
          <p>{usage.name_public}</p>
          <div>
            {usage.cost ? <p>Стоимость: {{paid: "Платно", free: "Бесплатно"}[usage.cost]}</p> : null}
            <p>{usage.description}</p>
            <table style={{inlineSize: "100%", borderCollapse: "collapse"}}>
              <tbody>
                <tr>
                  {Array(7).fill(null).map((_, i) => (
                    <td key={i} style={{textAlign: "center", fontSize: "0.9em", border: "1px solid #eee", backgroundColor: "#fafafa"}}>{["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"][i]}</td>
                  ))}
                </tr>
                <tr>
                  {Array(7).fill(null).map((localDay, i) => usage.schedules.find((schedule) => schedule.day_num === i) ?? localDay).map((day, i) => (
                    <td key={i} style={{whiteSpace: "pre-wrap", textAlign: "center", fontSize: "0.8em", border: "1px solid #eee"}}>{day?.time}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </Card.Section>
      ))}
    </Card>
  )
}