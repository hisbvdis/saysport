"use client";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useRef } from "react"
// -----------------------------------------------------------------------------
import { useIsMobile } from "@/app/_hooks/useIsMobile";
import { useDisclosure } from "@/app/_hooks/useDisclosure";
import type { PopoverRootPropsType, PopoverContextType } from "."
// -----------------------------------------------------------------------------


export default function PopoverRoot(props:PopoverRootPropsType) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const disclosure = useDisclosure();
  // -----------------------------------------------------------------------------
  const { children, isOpen=disclosure.isOpen, open=disclosure.open, close=disclosure.close, toggle=disclosure.toggle, isModal, shouldPushHistoryState=isModal ? "always" : undefined, afterClose: onClose, nonClosingParent } = props;
  // -----------------------------------------------------------------------------
  const rootRef = useRef<HTMLDialogElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement>(null);
  // -----------------------------------------------------------------------------
  const bodyOverflowY = useRef("");
  const bodyPaddingRight = useRef(0);
  const previouslyWasOpened = useRef(false);
  // -----------------------------------------------------------------------------

  const handleOpen = () => {
    previouslyWasOpened.current = true;

    // Push history state
    if ((shouldPushHistoryState === "always" || isMobile() && shouldPushHistoryState === "mobile") && !history.state.fromSite) {
      history.pushState({isPopover: true}, "");
      window.addEventListener("popstate", windowPopstateHandler, {once: true});
    }

    if (isModal) {
      // Disable <body> scroll, compute and set padding
      const scrollBarWidth = Number(window.innerWidth - document.documentElement.clientWidth);
      bodyPaddingRight.current = Number.parseFloat(getComputedStyle(document.body).paddingInlineEnd);
      document.body.style.paddingInlineEnd = `${bodyPaddingRight.current + scrollBarWidth}px`;
      bodyOverflowY.current = getComputedStyle(document.body).overflowY;
      document.body.style.overflowY = "hidden";
    }

    document.addEventListener("mousedown", handleNonContentMouseDown);
    document.addEventListener("keydown", handleDocumentKeydownEscape);
  }

  const handleClose = () => {
    if (!previouslyWasOpened.current) return;
    previouslyWasOpened.current = false;

    if (isModal) {
      // Restore <body> paddings and scroll
      document.body.style.paddingInlineEnd = `${bodyPaddingRight.current}px`;
      document.body.style.overflowY = bodyOverflowY.current;
    }

    removeEventListeners();
  }

  const removeEventListeners = () => {
    document.removeEventListener("mousedown", handleNonContentMouseDown);
    document.removeEventListener("keydown", handleDocumentKeydownEscape);
  }

  const handleNonContentMouseDown = (e:MouseEvent) => {
    if (e.button !== 0) return;
    if (contentRef.current?.contains(e.target as Node)) return;
    if (nonClosingParent?.contains(e.target as Node)) return;
    if (e.target === triggerRef.current) return;
    if (history.state.isPopover) router.back();
    close();
    if (onClose) onClose();
  }

  const handleDocumentKeydownEscape = (e:KeyboardEvent) => {
    if (e.code !== "Escape") return;
    if (history.state.isPopover) router.back();
    close();
    if (onClose) onClose();
  }

  const windowPopstateHandler = () => {
    close();
    if (onClose) onClose();
  }

  useEffect(() => {
    if (isOpen) handleOpen();
    else if (previouslyWasOpened.current) handleClose();
    return () => removeEventListeners();
  }, [isOpen])

  return (
    <PopoverContext.Provider value={{ isOpen, open, close, toggle, rootRef, contentRef, triggerRef, isModal }}>
      {children}
    </PopoverContext.Provider>
  )
}

export const PopoverContext = createContext<PopoverContextType>({} as PopoverContextType)