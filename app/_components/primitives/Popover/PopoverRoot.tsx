"use client";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useRef, useState } from "react";
// -----------------------------------------------------------------------------
import type { PopoverContextType, PopoverRootProps } from ".";
// -----------------------------------------------------------------------------
import { useDisclosure } from "@/app/_hooks/useDisclosure";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function PopoverRoot(props:PopoverRootProps) {
  const { children, isModal=false, popover="auto", shouldPushHistoryState=isModal } = props;
  const isPushedHistoryState = useRef(false);
  const disclosure = useDisclosure();
  const isOpen = props.isOpen ?? disclosure.isOpen;
  const openPopover = props.openPopover ?? disclosure.open;
  const closePopover = props.closePopover ?? disclosure.close;
  const togglePopover = props.togglePopover ?? disclosure.toggle;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogContentRef = useRef<HTMLDivElement>(null);
  const [ bodyPaddingRight, setBodyPaddingRight ] = useState<number>(0);
  const [ bodyOverflowY, setBodyOverflowY ] = useState<string>("");
  const isClickOnBackdrop = useRef(false);
  const router = useRouter();

  const onOpen = () => {
    // Показать модальное окно
    // dialogRef.current?.showModal(); // elem.close() doesn't work in Chrome
    // dialogRef.current?.showPopover();

    // Прокрутить вверх (потому что "show()" может скроллить, если первый элемента находится за пределами "viewPort")
    // dialogRef.current?.scrollTo(0, 0);

    // Добавить в историю браузера новую запись
    if (shouldPushHistoryState) {
      history.pushState({fromSite: true}, "");
      window.addEventListener("popstate", windowPopstateHandler);
    }

    if (isModal) {
      // У <body> отключить прокрутку, вычислить и задать отступ
      const scrollBarWidth = Number(window.innerWidth - document.documentElement.clientWidth);
      setBodyPaddingRight(Number.parseFloat(getComputedStyle(document.body).paddingInlineEnd));
      document.body.style.paddingInlineEnd = `${bodyPaddingRight + scrollBarWidth}px`;
      setBodyOverflowY(getComputedStyle(document.body).overflowY);
      document.body.style.overflowY = "hidden";
    }

    if (popover === "auto") {
      document.addEventListener("pointerdown", notContentPointerDownHandler);
      document.addEventListener("click", notContentClickHandler);
      document.addEventListener("keydown", handleDocumentKeydownEscape);
    }
  }

  const onClose = () => {
    // Закрыть модальное окно
    // dialogRef.current?.close(); // elem.close() doesn't work in Chrome

    if (isPushedHistoryState.current) {
      router.back();
      isPushedHistoryState.current = false;
    }

    if (isModal) {
      // Для <body> вернуть отступы и прокрутку, которые были до открытия модального окна
      document.body.style.paddingInlineEnd = `${bodyPaddingRight}px`;
      document.body.style.overflowY = bodyOverflowY;
    }

    document.removeEventListener("keydown", handleDocumentKeydownEscape);
    document.removeEventListener("pointerdown", notContentPointerDownHandler);
    document.removeEventListener("click", notContentClickHandler);
    window.removeEventListener("popstate", windowPopstateHandler);
  }

  const handleDocumentKeydownEscape = (e:KeyboardEvent) => {
    if (e.code !== "Escape") return;
    closePopover();
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
  }

  useEffect(() => {
    if (isOpen) onOpen();
    return () => onClose();
  }, [isOpen])

  return (
    <PopoverContext.Provider value={{ dialogContentRef, isModal, isOpen, dialogRef, openPopover, closePopover, togglePopover, styles }}>
      {children}
    </PopoverContext.Provider>
  )
}

export const PopoverContext = createContext<PopoverContextType>({} as PopoverContextType);