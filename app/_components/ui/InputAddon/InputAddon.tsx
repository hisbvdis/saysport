import styles from "./styles.module.css";


export default function InputAddon(props:Props) {
  const { children } = props;

  return (
    <span className={styles["inputAddon"]}>
      {children}
    </span>
  )
}

interface Props {
  children: React.ReactNode;
}