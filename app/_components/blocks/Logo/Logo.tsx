import Link from "next/link";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function Logo() {
  return (
    <div className={styles.logo}>
      <Link className={styles.logo__link} href="/">SaySport</Link>
    </div>
  )
}