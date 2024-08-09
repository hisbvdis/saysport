import clsx from "clsx";
import Link from "next/link";
// -----------------------------------------------------------------------------
import { Logo } from "@/app/_components/blocks/Logo/";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function PageHeader() {
  return (
    <header className={styles["pageHeader"]}>
      <div className={clsx("container", styles["pageHeader__container"])}>
        <Logo/>
        <Link className={styles["pageHeader__link"]} href="/catalog">Catalog</Link>
        <Link className={styles["pageHeader__link"]} href="/admin">Админ</Link>
        <Link className={styles["pageHeader__link"]} href="/object/add/org">Орг</Link>
        <Link className={styles["pageHeader__link"]} href="/object/add/place">Место</Link>
        <Link className={styles["pageHeader__link"]} href="/object/add/class">Секция</Link>
      </div>
    </header>
  )
}