import cx from "classix";
import type { City } from "@/drizzle/schema";
import type { ProcessedDBCategory } from "@/app/_types/db";
// -----------------------------------------------------------------------------
import { Popular } from ".";
import { Hero } from "@/app/_components/blocks/Hero";
import { Categories } from "@/app/_components/blocks/Categories";
import { CitySelector } from "@/app/_components/blocks/CitySelector";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function Home(props:Props) {
  const { city, categories } = props;

  return (
    <div className={cx(styles["home"], "container")}>
      <Hero className={styles["home__hero"]} city={city}/>
      <aside className={styles["home__aside"]}>
        <CitySelector className={styles["home__city"]} city={city}/>
        <Categories className={styles["home__categories"]} categories={categories}/>
      </aside>
      <Popular className={styles["home__popular"]}/>
    </div>
  )
}

interface Props {
  city?: City;
  categories: ProcessedDBCategory[];
}