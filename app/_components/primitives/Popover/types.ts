import type { RefObject } from "react";

export interface PopoverPropsType {
  children: React.ReactNode;
  isOpen?: boolean;
  open?: () => void;
  close?: () => void;
  toggle?: () => void;
  isModal?: boolean;
  shouldPushHistoryState?: "always" | "mobile";
  className?: string;
  style?: React.CSSProperties;
  afterClose?: () => void;
  nonClosingParent?: HTMLElement | null;
}

export interface PopoverRootPropsType extends PopoverPropsType {

}

export interface PopoverContextType extends
  Pick<PopoverPropsType, "isOpen" | "isModal">,
  Pick<Required<PopoverPropsType>, "open" | "close" | "toggle"> {
    rootRef: RefObject<HTMLDialogElement>;
    contentRef: RefObject<HTMLDivElement>;
    triggerRef: RefObject<HTMLElement>;
  }

export interface PopoverTriggerPropsType {
  children: React.ReactNode;
}

export interface PopoverContentPropsType {
  children: React.ReactNode;
}