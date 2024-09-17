import styles from "./styles.module.css";
import clsx from "clsx";

export default function ModalContent(props:Props) {
  const { className, children } = props;

  return (
    <div className={clsx(styles["modal__content"], className)}>
      {children}
    </div>
  )
}

interface Props {
  className: string;
  children: React.ReactNode;
}