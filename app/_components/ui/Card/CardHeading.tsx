import clsx from "clsx";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { CardContext, type CardHeadingProps } from ".";
// -----------------------------------------------------------------------------


export default function CardHeading(props:CardHeadingProps) {
  const { className, children, style } = props;
  const { styles } = useContext(CardContext);

  return (
    <div className={clsx(styles.card__heading, className)} style={style}>
      {children}
    </div>
  )
}