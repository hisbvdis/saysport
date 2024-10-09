import type { RefObject } from "react";

export interface PopoverPropsType {
  onClose: () => void;
  isModal?: boolean;
  shouldPushHistoryState?: "always" | "mobile";
  className?: string;
  style?: React.CSSProperties;
  nonClosingElem?: HTMLElement | null;
  children?: React.ReactNode;
}

export interface PopoverRootPropsType extends PopoverPropsType {}

export interface PopoverContextType extends
  Pick<PopoverPropsType, "isModal" | "onClose"> {
    rootRef: RefObject<HTMLDialogElement>;
    contentRef: RefObject<HTMLDivElement>;
}

export interface PopoverContentPropsType {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}