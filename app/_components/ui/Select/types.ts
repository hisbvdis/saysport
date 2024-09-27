import type { ChangeEvent, Dispatch, KeyboardEventHandler, RefObject, SetStateAction } from "react";


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
  value: string;
  onChange: (data:{name:string, value:string}) => void;
  items?: SelectItem[];
  requestItemsOnFirstTouch?: () => Promise<SelectItem[]>;
  requestItemsOnInputChange?: (value:string) => Promise<SelectItem[]>;
  requestMinInputLenght?: number;
}

export interface SelectRootProps extends SelectProps {
  setSuggestions: Dispatch<SetStateAction<SelectItem[]>>;
  suggestions: SelectItem[];
}

export interface SelectContextType extends Pick<SelectRootProps,
  "isAutocomplete" |
  "disabled" |
  "value" |
  "label" |
  "placeholder" |
  "required" |
  "name" |
  "suggestions"
> {
  inputRef: RefObject<HTMLInputElement>;
  inputValue: string;
  selectedItem?: SelectItem;
  handleInputChange: (e:ChangeEvent<HTMLInputElement>) => void;
  handleClearBtnClick: () => void;
  handleInputClick: () => void;
  handleInputFocus: () => void;
  handleInputKeydown: KeyboardEventHandler<HTMLInputElement>;
  closeMenu: () => void;
  isMenuOpen: boolean;
};

export  interface SelectArrowIconProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface SelectOptionProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface SelectValueProps {
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

export interface SelectContentProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export interface SelectItem {
  id: string;
  label: string;
  data?: any;
}