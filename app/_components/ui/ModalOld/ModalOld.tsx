"use client";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useRef, useState } from "react";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function ModalOld(props:Props) {
  /* [V] */const { isOpen, className, children, close } = props;
  /* [V] */const modalRef = useRef<HTMLDialogElement>(null);
  /* [V] */const [ bodyPaddingRight, setBodyPaddingRight ] = useState<number>(0);
  /* [V] */const [ bodyOverflowY, setBodyOverflowY ] = useState<string>("");
  /* [V] */const isClickOnBackdrop = useRef<boolean>();
  /* [V] */const router = useRouter();

  const openModal = () => {
    /* [V] */// modalRef.current?.showModal(); // elem.close() doesn't work in Chrome

    /* [V] */// Прокрутить вверх (потому что "show()" может скроллить, если первый элемента находится за пределами "viewPort")
    /* [V] */modalRef.current?.scrollTo(0, 0);

    /* [V] */// Добавить в историю браузера новую запись
    /* [V] */history.pushState({fromSite: true}, "");

    /* [V] */// У <body> отключить прокрутку, вычислить и задать отступ
    /* [V] */const scrollBarWidth = Number(window.innerWidth - document.documentElement.clientWidth);
    /* [V] */setBodyPaddingRight(Number.parseFloat(getComputedStyle(document.body).paddingInlineEnd));
    /* [V] */document.body.style.paddingInlineEnd = `${bodyPaddingRight + scrollBarWidth}px`;
    /* [V] */setBodyOverflowY(getComputedStyle(document.body).overflowY);
    /* [V] */document.body.style.overflowY = "hidden";

    // Добавление обработчиков модального окна
    /* [V] */document.addEventListener("keydown", documentKeydownEscapeHandler);
    /* [V] */modalRef.current?.addEventListener("pointerdown", backdropPointerdownHandler);
    /* [V] */modalRef.current?.addEventListener("pointerup", backdropPointerupHandler);
    /* [V] */window.addEventListener("popstate", windowPopstateHandler);
  }

  const closeModal = () => {
    /* [V] */// Закрыть модальное окно
    /* [V] */// modalRef.current?.close(); // elem.close() doesn't work in Chrome
    /* [V] */close();

    /* [V] */// Для <body> вернуть отступы и прокрутку, которые были до открытия модального окна
    /* [V] */document.body.style.paddingInlineEnd = `${bodyPaddingRight}px`;
    /* [V] */document.body.style.overflowY = bodyOverflowY;

    /* [V] */// Удалить обработчики модального окна
    /* [V] */document.removeEventListener("keydown", documentKeydownEscapeHandler);
    /* [V] */modalRef.current?.removeEventListener("pointerdown", backdropPointerdownHandler);
    /* [V] */modalRef.current?.removeEventListener("pointerup", backdropPointerupHandler);
    /* [V] */window.removeEventListener("popstate", windowPopstateHandler);
  }

  /* [V] */const documentKeydownEscapeHandler = (e:KeyboardEvent) => {
  /* [V] */  if (e.code !== "Escape") return;
  /* [V] */  closeModal();
  /* [V] */  router.back();
  /* [V] */}

  /* [V] */// Надавили указатель (ЛКМ) => Проверить и записать, является ли целевой элемент подложкой
  /* [V] */const backdropPointerdownHandler = (e:PointerEvent) => {
  /* [V] */  if (e.pointerType === "mouse" && e.pointerId !== 1) return;
  /* [V] */  isClickOnBackdrop.current = e.target === modalRef.current;
  /* [V] */}

  /* [V] */// "Клик" в области модального окна =>  Если переменная "надавили указатель" === true, закрыть модальное окно
  /* [V] */const backdropPointerupHandler = (e:PointerEvent) => {
  /* [V] */  if (e.pointerType === "mouse" && e.pointerId !== 1) return;
  /* [V] */  if (isClickOnBackdrop.current === false) return;
  /* [V] */  closeModal();
  /* [V] */  router.back();
  /* [V] */}

  /* [V] */// Нажали "Назад" в браузере =>  Закрыть модальное окно
  /* [V] */function windowPopstateHandler() {
  /* [V] */  if (!isOpen) return;
  /* [V] */  closeModal();
  /* [V] */}

  /* [V] */useEffect(() => {
  /* [V] */  if (isOpen) openModal();
  /* [V] */  else closeModal();
  /* [V] */}, [isOpen])

  return (
    <ModalContext.Provider value={{close}}>
      <dialog className={clsx(styles["modal"], className)} ref={modalRef} open={isOpen}>
        {children}
      </dialog>
    </ModalContext.Provider>
  )
}

export const ModalContext = createContext<ModalContextType>({} as ModalContextType);

interface Props {
  className?: string;
  children?: React.ReactNode;
  isOpen: boolean;
  close: () => void;
}

interface ModalContextType extends Pick<Props, "close"> {}