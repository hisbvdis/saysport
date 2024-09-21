import clsx from "clsx";
import { useContext } from "react"
// -----------------------------------------------------------------------------
import { ModalContext } from "./Modal"
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function ModalClose(props:Props) {
  const { className, style, children } = props;
  const { close } = useContext(ModalContext);

  return (
    <button className={clsx(styles["modal__close"], className)} type="button" onClick={close} style={style}>
      {children}
    </button>
  )
}

interface Props {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}