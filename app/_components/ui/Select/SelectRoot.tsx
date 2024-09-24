"use client";
import clsx from "clsx";
import type { SelectContextType, SelectItem, SelectRootProps } from "./SelectTypes";
import { type ChangeEvent, createContext, useEffect, useRef, useState } from "react";
// -----------------------------------------------------------------------------
import { useDebounce } from "@/app/_hooks/useDebounce";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function SelectRoot(props:SelectRootProps) {
  const {isAutocomplete, disabled, items=[], value, label, placeholder, children, className, style, required, onChange=(e=>e), name, requestItemsOnFirstTouch, requestItemsOnInputChange, requestMinInputLenght=3} = props;
  const debounce = useDebounce();
  const inputRef = useRef<HTMLInputElement>(null);
  const [localItems, setLocalItems] = useState(props.items ?? []);
  const [suggestions, setSuggestions] = useState(localItems);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SelectItem | undefined>(items.length ? localItems.find((item) => item.id === value) : {id: value ?? "", label: label ?? ""});
  const [inputValue, setInputValue] = useState<string>(selectedItem?.label ?? "");
  useEffect(() => {items.length ? setSelectedItem(localItems.find((item) => item.id === value)) : setSelectedItem({id: value ?? "", label: label ?? ""})}, [value]);
  useEffect(() => {items.length ? null : setInputValue(label ?? "")}, [label]);
  useEffect(() => {items.length ? setInputValue(selectedItem?.label ?? "") : null}, [selectedItem]);

  const handleInputClick = async () => {
    isAutocomplete ? setIsMenuVisible(true) : setIsMenuVisible(!isMenuVisible);
    if (requestItemsOnFirstTouch) {
      const newItems = await requestItemsOnFirstTouch();
      setLocalItems(newItems);
      setSuggestions(newItems);
    }
  }

  const handleInputFocus = async () => {
    isAutocomplete && setIsMenuVisible(true);
    if (requestItemsOnFirstTouch) {
      const newItems = await requestItemsOnFirstTouch();
      setLocalItems(newItems);
      setSuggestions(newItems);
    }
  }

  const handleInputChange = (e:ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setSuggestions([]);
    if (!e.target.value) setIsMenuVisible(false);
    if (requestItemsOnInputChange) {
      if (e.target.value.length < requestMinInputLenght) return;
      debounce(async () => {
        setSuggestions(await requestItemsOnInputChange(e.target.value));
      }, 300);
      setIsMenuVisible(true);
    } else {
      setSuggestions(localItems.filter((item) => item.label?.toLowerCase().includes(e.target.value?.toLowerCase())));
      setIsMenuVisible(true);
    }
  }

  const handleClearBtnClick = () => {
    setSelectedItem({id: "", label: ""});
    onChange({name: name ?? "", value: ""});
    inputRef.current?.focus();
  }

  const handleInputKeydown = (e:React.KeyboardEvent) => {
    if (!["Escape", "Tab", "Enter", "ArrowUp", "ArrowDown"].includes(e.code)) return;
    switch (e.code) {
      case "Escape":
      case "Tab": {
        items.length ? setInputValue(selectedItem?.label ?? "") : setInputValue(props.label ?? "");
        setSuggestions(localItems ?? []);
        setIsMenuVisible(false);
        break;
      }
      case "Enter": {
        if (isAutocomplete || isMenuVisible) break;
        setIsMenuVisible(true);
        break;
      }
      case "ArrowUp" : {
        if (isAutocomplete || isMenuVisible || !localItems.length) return;
        e.preventDefault();
        const selectedItemIndex = localItems.findIndex((item) => item.id === selectedItem?.id);
        if (selectedItemIndex === 0) return;
        const item = localItems?.[selectedItemIndex - 1];
        setSelectedItem(item);
        onChange({name: name ?? "", value: item.id});
        break;
      }
      case "ArrowDown" : {
        if (isAutocomplete || isMenuVisible || !localItems.length) return;
        e.preventDefault();
        const selectedItemIndex = localItems.findIndex((item) => item.id === selectedItem?.id);
        if (selectedItemIndex === localItems?.length - 1) return;
        const item = localItems?.[selectedItemIndex + 1];
        setSelectedItem(item);
        onChange({name: name ?? "", value: item.id});
        break;
      }
    }
  }

  return (
    <SelectContext.Provider value={{isAutocomplete, disabled, value, suggestions, inputRef, inputValue, placeholder, selectedItem, handleInputChange, handleClearBtnClick, required, name, handleInputClick, handleInputFocus, handleInputKeydown}}>
      <div className={clsx(styles["select"], className, disabled && styles["select--disabled"])} style={style}>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

export const SelectContext = createContext<SelectContextType>({} as SelectContextType);