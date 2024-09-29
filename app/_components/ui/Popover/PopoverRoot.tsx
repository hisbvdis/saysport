"use client";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import type { PopoverContextType, PopoverRootProps } from ".";
import { createContext, useEffect, useRef, useState } from "react";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function PopoverRoot(props:PopoverRootProps) {
  const { children, className, style, isOpen, close, isModal, popover="auto" } = props;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogContentRef = useRef<HTMLDivElement>(null);
  const [ bodyPaddingRight, setBodyPaddingRight ] = useState<number>(0);
  const [ bodyOverflowY, setBodyOverflowY ] = useState<string>("");
  const isClickOnBackdrop = useRef(false);
  const router = useRouter();

  const openPopover = () => {
    // Показать модальное окно
    // dialogRef.current?.showModal(); // elem.close() doesn't work in Chrome
    // dialogRef.current?.showPopover();

    // Прокрутить вверх (потому что "show()" может скроллить, если первый элемента находится за пределами "viewPort")
    // dialogRef.current?.scrollTo(0, 0);

    if (isModal) {
      // Добавить в историю браузера новую запись
      history.pushState({fromSite: true}, "");

      // У <body> отключить прокрутку, вычислить и задать отступ
      const scrollBarWidth = Number(window.innerWidth - document.documentElement.clientWidth);
      setBodyPaddingRight(Number.parseFloat(getComputedStyle(document.body).paddingInlineEnd));
      document.body.style.paddingInlineEnd = `${bodyPaddingRight + scrollBarWidth}px`;
      setBodyOverflowY(getComputedStyle(document.body).overflowY);
      document.body.style.overflowY = "hidden";

      window.addEventListener("popstate", windowPopstateHandler);
    }

    if (popover === "auto") {
      document.addEventListener("pointerdown", notContentPointerDownHandler);
      document.addEventListener("click", notContentClickHandler);
      document.addEventListener("keydown", documentKeydownEscapeHandler);
    }
  }

  const closePopover = () => {
    // Закрыть модальное окно
    // dialogRef.current?.close(); // elem.close() doesn't work in Chrome
    if (close) close();

    if (isModal) {
      // Для <body> вернуть отступы и прокрутку, которые были до открытия модального окна
      document.body.style.paddingInlineEnd = `${bodyPaddingRight}px`;
      document.body.style.overflowY = bodyOverflowY;

      window.removeEventListener("popstate", windowPopstateHandler);
    }

    if (popover === "auto") {
      document.removeEventListener("keydown", documentKeydownEscapeHandler);
      document.removeEventListener("pointerdown", notContentPointerDownHandler);
      document.removeEventListener("click", notContentClickHandler);
    }
  }

  const documentKeydownEscapeHandler = (e:KeyboardEvent) => {
    if (e.code !== "Escape") return;
    closePopover();
    if (isModal) router.back();
  }

  // Нажали "Назад" в браузере =>  Закрыть модальное окно
  function windowPopstateHandler() {
    if (!isOpen) return;
    closePopover();
  }

  // Надавили указатель (ЛКМ) => Проверить и записать, является ли целевой элемент подложкой
  const notContentPointerDownHandler = (e:PointerEvent) => {
    if (e.pointerType === "mouse" && e.pointerId !== 1) return;
    if (dialogContentRef.current?.contains(e.target as Node)) return;
    isClickOnBackdrop.current = true;
  }

  // "Клик" в области модального окна =>  Если переменная "надавили указатель" === true, закрыть модальное окно
  const notContentClickHandler = (e:MouseEvent) => {
    if (dialogContentRef.current?.contains(e.target as Node)) return;
    if (!isClickOnBackdrop.current) return;
    isClickOnBackdrop.current = false;
    closePopover();
    if (isModal) router.back();
  }

  useEffect(() => {
    if (isOpen) openPopover();
    else closePopover();
  }, [isOpen])

  return (
    <PopoverContext.Provider value={{ dialogContentRef }}>
      <dialog className={clsx(styles["popover"], isModal && styles["popover--modal"], className)} style={style} ref={dialogRef} open={isOpen}>
        {children}
      </dialog>
    </PopoverContext.Provider>
  )
}

export const PopoverContext = createContext<PopoverContextType>({} as PopoverContextType);