import type { RefObject } from "react";

export interface PopoverDemoProps {
  isOpen?: boolean;
  popover?: "auto" | "manual";
  closePopover?: () => void;
  openPopover?: () => void;
  togglePopover?: () => void;
  isModal?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface PopoverRootProps extends PopoverDemoProps {}

export interface PopoverContextType extends
  Pick<PopoverDemoProps, "isModal" |"isOpen">,
  Pick<Required<PopoverDemoProps>, "closePopover" | "openPopover" | "togglePopover"> {
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