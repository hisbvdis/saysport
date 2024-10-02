"use client";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function InputAddon(props:Props) {
  const { children, style } = props;

  return (
    <span className={styles["inputAddon"]} style={style}>
      {children}
    </span>
  )
}

interface Props {
  children: React.ReactNode;
  style?: React.CSSProperties;
}