import clsx from "clsx";
import Link from "next/link";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function Breadcrumbs(props:Props) {
  const { items } = props;
  const { className, id, style } = props;

  return (
    <nav className={clsx(styles.breadcrumbs, className)} id={id} style={style}>
      <ul className={styles.breadcrumbs__list}>
        {items?.filter(({label}) => label).map(({label, href}, i) => (
          <li className={styles.breadcrumbs__item} key={i}>
            {href
              ? <Link className={styles.breadcrumbs__link} href={href}>{label}</Link>
              : <span className={styles.breadcrumbs__span}>{label}</span>
            }
          </li>
        ))}
      </ul>
    </nav>
  )
}

interface Props {
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  items?: { label: string; href?: string | null }[];
}