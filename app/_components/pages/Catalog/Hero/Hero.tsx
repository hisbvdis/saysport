import clsx from "clsx";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";
import { useContext } from "react";
import { CatalogContext } from "../Catalog";


export default function Hero(props:Props) {
  const { className } = props;
  const { city } = useContext(CatalogContext);

  return (
    <section className={clsx(styles["hero"], className)}>
      <h1 className={styles["hero__heading"]}>
        <span>Каталог спортивных объектов</span>
        {city ? <span><br/> в {city.name_preposition}</span> : null}
      </h1>
    </section>
  )
}

interface Props {
  className: string;
}