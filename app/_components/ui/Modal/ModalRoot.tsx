"use client";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function ModalRoot(props:Props) {
  const { isOpen, children, close } = props;
  const modalRef = useRef<HTMLDialogElement>(null);
  const [ bodyPaddingRight, setBodyPaddingRight ] = useState<number>(0);
  const [ bodyOverflow, setBodyOverflow ] = useState<string>("");
  const isClickOnBackdrop = useRef<boolean>();

  const closeModal = () => {
    // Закрыть модальное окно
    close();

    // Для <body> вернуть отступы и прокрутку, которые были до открытия модального окна
    document.body.style.paddingInlineEnd = `${bodyPaddingRight}px`;
    document.body.style.overflow = bodyOverflow;

    // Разные варианты перехода "назад" в браузере (обычно или с заменой записи в истории)
    history.state.fromSite ? history.back() : history.replaceState(null, "");

    // Удалить обработчики модального окна
    document.removeEventListener("keydown", documentKeydownEscapeHandler);
    modalRef.current?.removeEventListener("pointerdown", backdropPointerdownHandler);
    modalRef.current?.removeEventListener("pointerup", backdropPointerupHandler);
    window.removeEventListener("popstate", windowPopstateHandler);
  }

  const documentKeydownEscapeHandler = (e:KeyboardEvent) => {
    if (e.code !== "Escape") return;
    closeModal();
  }

  // Надавили указатель (ЛКМ) => Проверить и записать, является ли целевой элемент подложкой
  const backdropPointerdownHandler = (e:PointerEvent) => {
    if (e.pointerType === "mouse" && e.pointerId !== 1) return;
    isClickOnBackdrop.current = e.target === modalRef.current;
  }

  // "Клик" в области модального окна =>  Если переменная "надавили указатель" === true, закрыть модальное окно
  const backdropPointerupHandler = (e:PointerEvent) => {
    if (e.pointerType === "mouse" && e.pointerId !== 1) return;
    if (isClickOnBackdrop.current === false) return;
    closeModal();
  }

  // Нажали "Назад" в браузере =>  Закрыть модальное окно
  function windowPopstateHandler() {
    if (!isOpen) return;
    closeModal();
  }

  useEffect(() => {
    if (!isOpen) return;

    // Добавить в историю браузера новую запись
    history.pushState({fromSite:true}, "");

    // У <body> отключить прокрутку, вычислить и задать отступ
    const scrollBarWidth = Number(window.innerWidth - document.documentElement.clientWidth);
    setBodyPaddingRight(Number.parseFloat(getComputedStyle(document.body).paddingInlineEnd));
    document.body.style.paddingInlineEnd = `${bodyPaddingRight + scrollBarWidth}px`;
    setBodyOverflow(getComputedStyle(document.body).overflow);
    document.body.style.overflow = "hidden";

    // Добавление обработчиков модального окна
    document.addEventListener("keydown", documentKeydownEscapeHandler);
    modalRef.current?.addEventListener("pointerdown", backdropPointerdownHandler);
    modalRef.current?.addEventListener("pointerup", backdropPointerupHandler);
    window.addEventListener("popstate", windowPopstateHandler);
  }, [isOpen])

  if (!isOpen) return null;
  return createPortal(
    <dialog className={styles["modal"]} ref={modalRef} open={isOpen}>
      {children}
    </dialog>
    ,document.body
  )
}

interface Props {
  close: () => void;
  children: React.ReactNode;
  isOpen: boolean;
}