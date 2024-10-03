import cx from "classix";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function Button(props:Props) {
  const { type = "button", onClick, tabIndex, disabled, className, style, children } = props;

  return (
    <button
      {...props}
      className={cx(styles["button"], className)}
      style={style}
      type={type}
      onClick={onClick}
      tabIndex={tabIndex}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

interface Props {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  tabIndex?: number;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}
