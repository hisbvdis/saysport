import type { Dispatch, MouseEventHandler, SetStateAction } from "react";

export interface MenuRootProps {
  onSelect: (itemId:string) => void;
  isOpen: boolean;
  items: MenuItemType[];
  value: string;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  close?: () => void;
}

export interface MenuContextType extends Pick<MenuRootProps, "items"> {
  focusedItemIndex: number;
  setFocusedItemIndex: Dispatch<SetStateAction<number>>;
  selectFocusedItem: () => void;
}

export interface MenuItemType {
  id: string;
  label: string;
}

export interface MenuValueProps {
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