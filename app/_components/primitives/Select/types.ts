import type { ChangeEvent, Dispatch, FocusEventHandler, KeyboardEventHandler, RefObject, SetStateAction } from "react";


export interface SelectProps {
  isAutocomplete?: boolean;
  name?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange?: (data:{name:string, value:string}) => void;
  onChangeData?: (data:any) => void;
  items?: SelectItemType[];
  requestItemsOnFirstTouch?: () => Promise<SelectItemType[]>;
  requestItemsOnInputChange?: (value:string) => Promise<SelectItemType[]>;
  requestMinInputLenght?: number;
}

export interface SelectRootProps extends SelectProps {
  setSuggestions: Dispatch<SetStateAction<SelectItemType[]>>;
  suggestions: SelectItemType[];
}

export interface SelectContextType extends Pick<SelectRootProps,
  "isAutocomplete" |
  "disabled" |
  "value" |
  "label" |
  "placeholder" |
  "required" |
  "name" |
  "onChange" |
  "suggestions"
> {
  styles: { readonly [key: string]: string };
  inputRef: RefObject<HTMLInputElement>;
  selectRootRef: RefObject<HTMLDivElement>;
  inputValue: string;
  selectedItem?: SelectItemType;
  handleInputChange: (e:ChangeEvent<HTMLInputElement>) => void;
  handleClearBtnClick: () => void;
  handleInputClick: () => void;
  handleInputFocus: FocusEventHandler;
  handleInputKeydown: KeyboardEventHandler<HTMLInputElement>;
  closeMenu: () => void;
  isMenuOpen: boolean;
  handleMenuSelect: (itemId:string) => void;
  onMenuCLose: () => void;
};

export  interface SelectArrowIconProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface SelectItemProps {
  itemIndex: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface SelectItemTextProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface SelectCloseButtonProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface SelectInputProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface SelectMenuProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface SelectItemType {
  id: string;
  label: string;
  data?: any;
}