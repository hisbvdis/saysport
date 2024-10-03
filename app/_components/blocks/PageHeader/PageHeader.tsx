import Link from "next/link";
// -----------------------------------------------------------------------------
import { Logo } from "@/app/_components/blocks/Logo";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default async function PageHeader(props:{isLogin:boolean}) {
  return (
    <header className={styles["pageHeader"]}>
      <div className={styles["pageHeader__container"]}>
        <Logo/>
        {props.isLogin ? (
          <>
            <Link className={styles["pageHeader__link"]} href="/admin">Adm</Link>
            <Link className={styles["pageHeader__link"]} href="/object/add/org">Org</Link>
            <Link className={styles["pageHeader__link"]} href="/object/add/place">Plc</Link>
            <Link className={styles["pageHeader__link"]} href="/object/add/class">Cls</Link>
          </>
        ) : null}
      </div>
    </header>
  )
}