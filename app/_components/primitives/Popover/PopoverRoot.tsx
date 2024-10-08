"use client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useEffect, useRef } from "react"
// -----------------------------------------------------------------------------
import { useDisclosure } from "@/app/_hooks/useDisclosure";
import type { PopoverRootPropsType, PopoverContextType } from "."
// -----------------------------------------------------------------------------


export default function PopoverRoot(props:PopoverRootPropsType) {
  const router = useRouter();
  const disclosure = useDisclosure();
  const isMobile = dynamic(() => import("@/app/_hooks/useIsMobile"), {ssr: false});
  const { children, isOpen=disclosure.isOpen, open=disclosure.open, close=disclosure.close, isModal, shouldPushHistoryState=isModal ? "always" : undefined, onClose, nonClosingParent } = props;
  // -----------------------------------------------------------------------------
  const rootRef = useRef<HTMLDialogElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  // -----------------------------------------------------------------------------
  const bodyPaddingRight = useRef(0);
  const bodyOverflowY = useRef("");
  // -----------------------------------------------------------------------------
  const previouslyWasOpened = useRef(false);;

  const afterOpening = () => {
    previouslyWasOpened.current = true;

    // Push history state
    if ((shouldPushHistoryState === "always" || isMobile && shouldPushHistoryState === "mobile") && !history.state.fromSite) {
      history.pushState({fromSite: true}, "");
      window.addEventListener("popstate", windowPopstateHandler, {once: true});
    }

    // Disable <body> scroll, compute and set padding
    if (isModal) {
      const scrollBarWidth = Number(window.innerWidth - document.documentElement.clientWidth);
      bodyPaddingRight.current = Number.parseFloat(getComputedStyle(document.body).paddingInlineEnd);
      document.body.style.paddingInlineEnd = `${bodyPaddingRight.current + scrollBarWidth}px`;
      bodyOverflowY.current = getComputedStyle(document.body).overflowY;
      document.body.style.overflowY = "hidden";
    }

    document.addEventListener("mousedown", handleNonContentMouseDown);
    document.addEventListener("keydown", handleDocumentKeydownEscape);
  }

  const afterClosing = () => {
    previouslyWasOpened.current = false;

    // Restore <body> paddings and scroll
    if (isModal) {
      document.body.style.paddingInlineEnd = `${bodyPaddingRight.current}px`;
      document.body.style.overflowY = bodyOverflowY.current;
    }

    document.removeEventListener("mousedown", handleNonContentMouseDown);
    document.removeEventListener("keydown", handleDocumentKeydownEscape);
  }

  const handleNonContentMouseDown = useCallback((e:MouseEvent) => {
    if (e.button !== 0) return;
    if (contentRef.current?.contains(e.target as Node)) return;
    if (nonClosingParent?.contains(e.target as Node)) return;
    if (history.state.fromSite) router.back();
    close();
    if (onClose) onClose();
  }, [nonClosingParent])

  const handleDocumentKeydownEscape = useCallback((e:KeyboardEvent) => {
    if (e.code !== "Escape") return;
    if (history.state.fromSite) router.back();
    close();
    if (onClose) onClose();
  }, [])

  const windowPopstateHandler = () => {
    close();
    if (onClose) onClose();
  }

  useEffect(() => {
    if (isOpen) afterOpening();
    else if (previouslyWasOpened.current) afterClosing();
  }, [isOpen])

  return (
    <PopoverContext.Provider value={{ isOpen, open, close, rootRef, contentRef, isModal }}>
      {children}
    </PopoverContext.Provider>
  )
}

export const PopoverContext = createContext<PopoverContextType>({} as PopoverContextType)