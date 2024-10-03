import type { RefObject } from "react";

export interface PopoverPropsType {
  children: React.ReactNode;
  isOpen?: boolean;
  open?: () => void;
  close?: () => void;
  isModal?: boolean;
  shouldPushHistoryState?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClose?: () => void;
  nonClosingParent?: HTMLElement | null;
}

export interface PopoverRootPropsType extends PopoverPropsType {

}

export interface PopoverContextType extends
  Pick<PopoverPropsType, "isOpen" | "isModal">,
  Pick<Required<PopoverPropsType>, "open" | "close"> {
    rootRef: RefObject<HTMLDialogElement>;
    contentRef: RefObject<HTMLDivElement>;
  }

export interface PopoverTriggerPropsType {
  children: React.ReactNode;
}

export interface PopoverContentPropsType {
  children: React.ReactNode;
}