import clsx from "clsx";
import styles from "./styles.module.css";
import { Logo } from "@/app/_components/blocks/Logo/";
import Link from "next/link";

export default function PageHeader() {
  return (
    <header className={styles["pageHeader"]}>
      <div className={clsx("container", styles["pageHeader__container"])}>
        <Logo/>
        {/* <Link className={styles["pageHeader__link"]} href="/catalog">Catalog</Link> */}
        <Link className={styles["pageHeader__link"]} href="/admin">Admin</Link>
        <Link className={styles["pageHeader__link"]} href="/object/add/org">Add org</Link>
        <Link className={styles["pageHeader__link"]} href="/object/add/place">Add place</Link>
      </div>
    </header>
  )
}