import clsx from "clsx";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function _(props:Props) {
  const { className, children, style } = props;

  return (
    <div className={clsx(styles.card__heading, className)} style={style}>
      {children}
    </div>
  )
}

interface Props {
  className?: string,
  children?: React.ReactNode,
  style?: React.CSSProperties
}