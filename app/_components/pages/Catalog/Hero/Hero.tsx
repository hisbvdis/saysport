import clsx from "clsx";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function Hero(props:Props) {
  const { className } = props;

  return (
    <section className={clsx(styles["hero"], className)}>
      <h1 className={styles["hero__heading"]}>Каталог спортивных объектов</h1>
    </section>
  )
}

interface Props {
  className: string;
}