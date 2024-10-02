import type { RefObject } from "react";

export interface PopoverProps {
  isOpen?: boolean;
  popover?: "auto" | "manual";
  closePopover?: () => void;
  openPopover?: () => void;
  togglePopover?: () => void;
  isModal?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  shouldPushHistoryState?: boolean;
  onClose?: () => void;
  nonCloseParent?: HTMLElement | null;
}

export interface PopoverRootProps extends PopoverProps {}

export interface PopoverContextType extends
  Pick<PopoverProps, "isModal" |"isOpen">,
  Pick<Required<PopoverProps>, "closePopover" | "openPopover" | "togglePopover"> {
  dialogRef: RefObject<HTMLDialogElement>;
  dialogContentRef: RefObject<HTMLDivElement>;
  styles: { readonly [key: string]: string };
}

export interface PopoverContentProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export interface PopoverTriggerProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}