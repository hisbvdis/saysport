import clsx from "clsx";
import Link from "next/link";
import { auth, signOut } from "@/auth";
// -----------------------------------------------------------------------------
import { Logo } from "@/app/_components/blocks/Logo/";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default async function PageHeader() {
  const session = await auth();

  return (
    <header className={styles["pageHeader"]}>
      <div className={clsx("container", styles["pageHeader__container"])}>
        <Logo/>
        {session ? (
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
        ) : null}
      </div>
    </header>
  )
}