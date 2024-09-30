import clsx from "clsx";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { SelectContext } from "./";
// -----------------------------------------------------------------------------



export default function SelectTrigger(props:SelectTriggerProps) {
  const { children, className, style } = props;
  const { styles } = useContext(SelectContext);

  return (<>
    <div className={clsx(styles["selectTrigger"], className)} style={style}>
      {children}
    </div>
  </>)
}

export interface SelectTriggerProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}