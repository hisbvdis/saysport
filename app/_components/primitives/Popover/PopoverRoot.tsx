"use client";
import cx from "classix";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useRef } from "react"
// -----------------------------------------------------------------------------
import { useIsMobile } from "@/app/_hooks/useIsMobile";
import type { PopoverRootPropsType, PopoverContextType } from "."
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function PopoverRoot(props:PopoverRootPropsType) {
  const router = useRouter();
  const isMobile = useIsMobile();
  // -----------------------------------------------------------------------------
  const { children, isModal, shouldPushHistoryState=isModal ? "always" : undefined, onClose, nonClosingElem } = props;
  // -----------------------------------------------------------------------------
  const rootRef = useRef<HTMLDialogElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  // -----------------------------------------------------------------------------
  const bodyOverflowY = useRef("");
  const bodyPaddingRight = useRef(0);
  const previouslyWasOpened = useRef(false);
  // -----------------------------------------------------------------------------

  const handleMount = () => {
    previouslyWasOpened.current = true;

    // Push history state
    if (!history.state.isPopover && (shouldPushHistoryState === "always" || isMobile() && shouldPushHistoryState === "mobile")) {
      history.scrollRestoration = "manual";
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

  const handleUnmount = () => {
    previouslyWasOpened.current = false;

    if (isModal) {
      // Restore <body> paddings and scroll
      document.body.style.paddingInlineEnd = `${bodyPaddingRight.current}px`;
      document.body.style.overflowY = bodyOverflowY.current;
    }

    document.removeEventListener("mousedown", handleNonContentMouseDown);
    document.removeEventListener("keydown", handleDocumentKeydownEscape);
  }

  const handleNonContentMouseDown = (e:MouseEvent) => {
    if (e.button !== 0) return;
    if (contentRef.current?.contains(e.target as Node)) return;
    if (nonClosingElem?.contains(e.target as Node)) return;
    if (history.state.isPopover) router.back();
    history.scrollRestoration = "auto";
    if (onClose) onClose();
  }

  const handleDocumentKeydownEscape = (e:KeyboardEvent) => {
    if (e.code !== "Escape") return;
    if (history.state.isPopover) router.back();
    history.scrollRestoration = "auto";
    if (onClose) onClose();
  }

  const windowPopstateHandler = () => {
    if (onClose) onClose();
    history.scrollRestoration = "auto";
  }

  useEffect(() => {
    handleMount();
    return () => handleUnmount();
  }, [])

  return (
    <PopoverContext.Provider value={{ onClose, rootRef, contentRef, isModal }}>
      <dialog className={cx(styles["popover"], isModal && styles["popover--modal"])} open={true} ref={rootRef}>
        {children}
      </dialog>
    </PopoverContext.Provider>
  )
}

export const PopoverContext = createContext<PopoverContextType>({} as PopoverContextType)