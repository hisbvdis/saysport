import type { ChangeEvent, KeyboardEventHandler, RefObject } from "react";

export interface SelectRootProps {
  isAutocomplete?: boolean;
  name?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  items?: SelectItem[];
  value?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  onChange: (data:{name:string, value:string}) => void;
  requestItemsOnFirstTouch?: () => Promise<SelectItem[]>;
  requestItemsOnInputChange?: (value:string) => Promise<SelectItem[]>;
  requestMinInputLenght?: number;
}

export interface SelectContextType extends Pick<SelectRootProps,
  "isAutocomplete" |
  "disabled" |
  "value" |
  "label" |
  "placeholder" |
  "required" |
  "name"
> {
  suggestions: SelectItem[];
  inputRef: RefObject<HTMLInputElement>;
  inputValue: string;
  selectedItem?: SelectItem;
  handleInputChange: (e:ChangeEvent<HTMLInputElement>) => void;
  handleClearBtnClick: () => void;
  handleInputClick: () => void;
  handleInputFocus: () => void;
  handleInputKeydown: KeyboardEventHandler<HTMLInputElement>;
};

export interface SelectItem {
  id: string;
  label: string;
  data?: any;
}

export  interface SelectArrowIconProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface SelectContentProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export interface SelectInputProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface SelectTriggerProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface SelectCloseButtonProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}