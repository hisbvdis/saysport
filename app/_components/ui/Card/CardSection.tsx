import clsx from "clsx";
// -----------------------------------------------------------------------------
import type { CardSectionProps } from ".";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function CardSection(props: CardSectionProps) {
  const { className, children, style } = props;

  return (
    <div className={clsx(styles["card__section"], className)} style={style}>
      {children}
    </div>
  );
}