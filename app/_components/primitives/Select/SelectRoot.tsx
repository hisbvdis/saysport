"use client";
import cx from "classix";
import { type ChangeEvent, createContext, useEffect, useRef, useState } from "react";
// -----------------------------------------------------------------------------
import type { SelectContextType, SelectItemType, SelectRootProps } from ".";
// -----------------------------------------------------------------------------
import { useDebounce } from "@/app/_hooks/useDebounce";
import { useDisclosure } from "@/app/_hooks/useDisclosure";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function SelectRoot(props:SelectRootProps) {
  const { isAutocomplete, disabled, items=[], value, label, placeholder, children, className, style, required, onChange=(e=>e), onChangeData=(e=>e), name, requestItemsOnFirstTouch, requestItemsOnInputChange, requestMinInputLenght=3, suggestions, setSuggestions } = props;
  const debounce = useDebounce();
  const selectRootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [ localItems, setLocalItems ] = useState(props.items ?? []);
  const { isOpen:isMenuOpen, open:openMenu, close:closeMenu, toggle:toggleMenu } = useDisclosure(false);
  const emptySelectedItem = {id: value ?? "", label: label ?? ""};
  const [ selectedItem, setSelectedItem ] = useState<SelectItemType>(items.length ? (localItems.find((item) => item.id === value) ?? emptySelectedItem) : emptySelectedItem);
  const [ inputValue, setInputValue ] = useState<string>(selectedItem?.label ?? "");
  useEffect(() => {setSuggestions(localItems)}, []);
  useEffect(() => {items.length ? setSelectedItem(localItems.find((item) => item.id === value) ?? emptySelectedItem) : setSelectedItem(emptySelectedItem)}, [value]);
  useEffect(() => {items.length ? null : setInputValue(label ?? "")}, [label]);
  useEffect(() => {items.length ? setInputValue(selectedItem?.label ?? "") : null}, [selectedItem]);

  const handleInputClick = async () => {
    isAutocomplete ? openMenu() : toggleMenu();
    if (requestItemsOnFirstTouch) {
      const newItems = await requestItemsOnFirstTouch();
      setLocalItems(newItems);
      setSuggestions(newItems);
    }
  }

  const handleInputFocus = async (e:React.FocusEvent) => {
    // if (e.relatedTarget && inputRef.current && e.relatedTarget !== inputRef.current) return;
    if (!e.relatedTarget) return;
    isAutocomplete && openMenu();
    if (requestItemsOnFirstTouch) {
      const newItems = await requestItemsOnFirstTouch();
      setLocalItems(newItems);
      setSuggestions(newItems);
    }
  }

  const handleInputChange = (e:ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setSuggestions([]);
    if (!e.target.value) closeMenu();
    if (requestItemsOnInputChange) {
      if (e.target.value.length < requestMinInputLenght) return;
      debounce(async () => {
        setSuggestions(await requestItemsOnInputChange(e.target.value.trim()));
      }, 300);
      openMenu();
    } else {
      setSuggestions(localItems.filter((item) => item.label?.trim().toLowerCase().includes(e.target.value?.trim().toLowerCase())));
      openMenu();
    }
  }

  const handleClearBtnClick = () => {
    setSelectedItem({id: "", label: ""});
    onChange({name: name ?? "", value: ""});
    onChangeData({});
    // inputRef.current?.focus();
  }

  const handleMenuSelect = (itemId:string) => {
    const item = suggestions.find((suggestion) => suggestion.id === itemId);
    onChange({name: name ?? "", value: itemId});
    onChangeData(item?.data);
    setSuggestions(localItems ?? []);
    closeMenu();
  }

  const onMenuCLose = () => {
    closeMenu();
    setSuggestions(localItems ?? []);
    items.length ? setInputValue(selectedItem?.label ?? "") : setInputValue(label ?? "");
  }

  const handleInputKeydown = (e:React.KeyboardEvent) => {
    if (!["Escape", "Tab", "Enter", "ArrowUp", "ArrowDown"].includes(e.code)) return;
    switch (e.code) {
      case "Escape":
      case "Tab": {
        items.length ? setInputValue(selectedItem?.label ?? "") : setInputValue(props.label ?? "");
        setSuggestions(localItems ?? []);
        closeMenu();
        break;
      }
      case "Enter": {
        e.preventDefault();
        if (isAutocomplete || isMenuOpen) break;
        openMenu();
        break;
      }
      case "ArrowUp" : {
        if (isAutocomplete || isMenuOpen || !localItems.length) return;
        e.preventDefault();
        const selectedItemIndex = localItems.findIndex((item) => item.id === selectedItem?.id);
        if (selectedItemIndex === 0) return;
        const item = localItems?.[selectedItemIndex - 1];
        setSelectedItem(item);
        onChange({name: name ?? "", value: item.id});
        break;
      }
      case "ArrowDown" : {
        if (isAutocomplete || isMenuOpen || !localItems.length) return;
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
    <SelectContext.Provider value={{ isAutocomplete, disabled, value, inputRef, inputValue, placeholder, selectedItem, handleInputChange, handleClearBtnClick, required, name, handleInputClick, handleInputFocus, handleInputKeydown, isMenuOpen, closeMenu, onChange, handleMenuSelect, styles, selectRootRef, onMenuCLose, suggestions }}>
      <div className={cx(styles["select__root"], className, disabled && styles["select__root--disabled"])} style={style} ref={selectRootRef}>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

export const SelectContext = createContext<SelectContextType>({} as SelectContextType);