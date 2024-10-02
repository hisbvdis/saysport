import Link from "next/link";
import { cookies } from "next/headers";
// -----------------------------------------------------------------------------
import { Logo } from "@/app/_components/blocks/Logo";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default async function PageHeader() {
  // const isLogin = cookies().get("isLogin");

  return (
    <header className={styles["pageHeader"]}>
      <div className={styles["pageHeader__container"]}>
        <Logo/>
        {/* {isLogin === "true" ? (
          <>
            <Link className={styles["pageHeader__link"]} href="/admin">Adm</Link>
            <Link className={styles["pageHeader__link"]} href="/object/add/org">Org</Link>
            <Link className={styles["pageHeader__link"]} href="/object/add/place">Plc</Link>
            <Link className={styles["pageHeader__link"]} href="/object/add/class">Cls</Link>
            <form action={async () => {
              "use server";
              await signOut();
            }}><button type="submit">Exit</button></form>
          </>
        ) : null} */}
      </div>
    </header>
  )
}