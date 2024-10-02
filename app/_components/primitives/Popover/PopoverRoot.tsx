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
  const { children, isModal=false, popover="auto", shouldPushHistoryState, onClose, nonCloseParent } = props;
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
  const prevIsOpen = useRef(false);
  const isHistoryPushed = useRef(false);

  const open = () => {
    prevIsOpen.current = true;

    if (shouldPushHistoryState && !isHistoryPushed.current) {
      // Push history state
      history.pushState({fromSite: true}, "");
      window.addEventListener("popstate", windowPopstateHandler);
      isHistoryPushed.current = true;
    }

    if (isModal) {
      // Disable <body> scroll, compute and set padding
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

  const close = () => {
    prevIsOpen.current = false;

    if (isModal) {
      // Restore <body> paddings and scroll
      document.body.style.paddingInlineEnd = `${bodyPaddingRight}px`;
      document.body.style.overflowY = bodyOverflowY;
    }

    // Remove event handlers
    document.removeEventListener("keydown", handleDocumentKeydownEscape);
    document.removeEventListener("pointerdown", notContentPointerDownHandler);
    document.removeEventListener("click", notContentClickHandler);
    window.removeEventListener("popstate", windowPopstateHandler);

    if (onClose) onClose();
  }

  const handleDocumentKeydownEscape = (e:KeyboardEvent) => {
    if (e.code !== "Escape") return;
    closePopover();
    if (isHistoryPushed.current) {
      isHistoryPushed.current = false;
      router.back();
    }
  }

  function windowPopstateHandler() {
    closePopover();
  }

  const notContentPointerDownHandler = (e:PointerEvent) => {
    if (e.pointerType === "mouse" && e.pointerId !== 1) return;
    if (dialogContentRef.current?.contains(e.target as Node)) return;
    if (nonCloseParent?.contains(e.target as Node)) return;
    isClickOnBackdrop.current = true;
  }

  const notContentClickHandler = (e:MouseEvent) => {
    if (dialogContentRef.current?.contains(e.target as Node)) return;
    if (nonCloseParent?.contains(e.target as Node)) return;
    if (!isClickOnBackdrop.current) return;
    isClickOnBackdrop.current = false;
    closePopover();
    if (isHistoryPushed.current) {
      isHistoryPushed.current = false;
      router.back();
    }
  }

  useEffect(() => {
    if (isOpen) open();
    else if (prevIsOpen.current) close();
  }, [isOpen])

  return (
    <PopoverContext.Provider value={{ dialogContentRef, isModal, isOpen, dialogRef, openPopover, closePopover, togglePopover, styles }}>
      {children}
    </PopoverContext.Provider>
  )
}

export const PopoverContext = createContext<PopoverContextType>({} as PopoverContextType);