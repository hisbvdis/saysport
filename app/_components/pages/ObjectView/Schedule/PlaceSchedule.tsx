import clsx from "clsx";
import type { ProcObjectUsage } from "@/app/_types/types";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function PlaceSchedule(props:{usage:ProcObjectUsage}) {
  const { usage } = props;

  return (
    <table className={clsx(styles["table"], styles["table--periods"])}>
      <tbody>
        <tr>
          {usage.schedules.map((day, i) => (
            <th key={i} className={styles["table__th"]}>{["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"][day.day_num]}</th>
          ))}
        </tr>
        <tr>
          {usage.schedules.map((localDay, i) => usage.schedules.find((schedule) => schedule.day_num === localDay.day_num) ?? localDay).map((day, i) => (
            <td key={i} className={clsx(styles["table__td"])}>{day?.time}</td>
          ))}
        </tr>
      </tbody>
    </table>
  )
}