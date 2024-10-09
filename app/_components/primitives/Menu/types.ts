import type { Dispatch, SetStateAction } from "react";

export interface MenuPropsType {
  value: string;
  items: MenuItemType[];
  onSelect: (itemId:string) => void;
  // -----------------------------------------------------------------------------
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClose?: () => void;
}

export interface MenuRootPropsType extends MenuPropsType {}

export interface MenuContextType extends Pick<MenuPropsType, "items"> {
  focusedItemIndex: number;
  setFocusedItemIndex: Dispatch<SetStateAction<number>>;
  selectFocusedItem: () => void;
}

export interface MenuItemType {
  id: string;
  label: string;
}

export interface MenuItemTextProps {
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export interface MenuItemProps {
  itemIndex: number;
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}