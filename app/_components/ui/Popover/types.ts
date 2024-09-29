import type { RefObject } from "react";

export interface PopoverProps {
  isOpen: boolean;
  popover?: "auto" | "manual";
  close?: () => void;
  isModal?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface PopoverRootProps extends PopoverProps {}

export interface PopoverContextType {
  dialogContentRef: RefObject<HTMLDivElement>;
}

export interface PopoverContentProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}