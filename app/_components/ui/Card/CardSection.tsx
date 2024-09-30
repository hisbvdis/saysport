import clsx from "clsx";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { CardContext, type CardSectionProps } from ".";
// -----------------------------------------------------------------------------


export default function CardSection(props: CardSectionProps) {
  const { className, children, style } = props;
  const { styles } = useContext(CardContext);

  return (
    <div className={clsx(styles.card__section, className)} style={style}>
      {children}
    </div>
  );
}