import cx from "classix";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { SelectContext } from "./";
// -----------------------------------------------------------------------------


export default function SelectTrigger(props:SelectTriggerProps) {
  const { children, className, style } = props;
  const { styles } = useContext(SelectContext);

  return (<>
    <div className={cx(styles["select__trigger"], className)} style={style}>
      {children}
    </div>
  </>)
}

export interface SelectTriggerProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}