import clsx from "clsx";
import type { ProcessedObjectUsage } from "@/app/_types/db";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function ClassSchedule(props:{usage:ProcessedObjectUsage}) {
  const { usage } = props;
  const uniqueStartTimes = usage.schedules
    .filter((day) => day.time)
    .flatMap((day) => day.time.split("\n"))
    .filter((time, i, arr) => arr.indexOf(time) === i)
    .toSorted((a, b) => Number(a.split(":")[0]) - Number(b.split(":")[0]));

  return (
    <table className={styles["table"]}>
      <thead>
        <tr>
          {Array(7).fill(null).map((_, i) => (
            <th className={styles["table__th"]} key={i}>{["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"][i]}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {uniqueStartTimes.map((_, timeRowIndex) => (
          <tr key={timeRowIndex}>
            {Array(7).fill(null).map((_, dayIndex) => usage.schedules[dayIndex].time.split("\n").includes(uniqueStartTimes[timeRowIndex]) ? uniqueStartTimes[timeRowIndex] : "").map((time, i) => (
              <td key={i} className={clsx(styles["table__td"], time.split(" - ")[0] && styles["table__td--filled"])}>{time.split(" - ")[0]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}