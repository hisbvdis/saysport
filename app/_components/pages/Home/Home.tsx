import clsx from "clsx";
import type { City } from "@/drizzle/schema";
import type { ProcessedCategory } from "@/app/_types/types";
// -----------------------------------------------------------------------------
import { Categories, Popular } from ".";
import { Hero } from "../../blocks/Hero";
import { CitySelector } from "../../blocks/CitySelector";
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function Home(props:Props) {
  const { city, categories } = props;

  return (
    <div className={clsx(styles["home"], "container")}>
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
  categories: ProcessedCategory[];
}