import cx from "classix";
import type { City } from "@/drizzle/schema";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function Hero(props:Props) {
  const { className, city } = props;

  return (
    <section className={cx(styles["hero"], className)}>
      <h1 className={styles["hero__heading"]}>
        <span>Каталог спортивных объектов</span>
        {city ? <span><br/> в {city.name_preposition}</span> : null}
      </h1>
    </section>
  )
}

interface Props {
  className: string;
  city?: City;
}