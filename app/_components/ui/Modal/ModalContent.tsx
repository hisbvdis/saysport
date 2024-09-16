import { useContext, useEffect, useRef } from "react";
import styles from "./styles.module.css";

export default function ModalContent(props:{children:React.ReactNode}) {
  return (
    <div className={styles["modal__content"]}>
      {props.children}
    </div>
  )
}