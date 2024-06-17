import { useId } from "react";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";

export default function RequiredInput(props:Props) {
  const { name=useId(), isValidIf=false, checked=false } = props;

  return (
    <input
      type="radio"
      className={styles["requiredInput"]}
      name={name}
      checked={checked}
      onChange={e=>e}
      required={!isValidIf}
      tabIndex={-1}
    />
  )
}

interface Props {
  name: string;
  isValidIf?: boolean;
  checked: boolean;
  required: boolean;
}