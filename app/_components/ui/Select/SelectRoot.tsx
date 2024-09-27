import clsx from "clsx";
import { type ChangeEvent, createContext, useEffect, useRef, useState } from "react";
// -----------------------------------------------------------------------------
import type { SelectContextType, SelectItem, SelectRootProps } from ".";
// -----------------------------------------------------------------------------
import { useDebounce } from "@/app/_hooks/useDebounce";
import { useDisclosure } from "@/app/_hooks/useDisclosure";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function SelectRoot(props:SelectRootProps) {
  const { isAutocomplete, disabled, items=[], value, label, placeholder, children, className, style, required, onChange=(e=>e), name, requestItemsOnFirstTouch, requestItemsOnInputChange, requestMinInputLenght=3, suggestions, setSuggestions } = props;
  const debounce = useDebounce();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [ localItems, setLocalItems ] = useState(props.items ?? []);
  const { isOpen:isMenuOpen, open:openMenu, close:closeMenu, toggle:toggleMenu } = useDisclosure(false);
  const emptySelectedItem = {id: value ?? "", label: label ?? ""};
  const [ selectedItem, setSelectedItem ] = useState<SelectItem>(items.length ? (localItems.find((item) => item.id === value) ?? emptySelectedItem) : emptySelectedItem);
  const [ inputValue, setInputValue ] = useState<string>(selectedItem?.label ?? "");
  useEffect(() => {items.length ? setSelectedItem(localItems.find((item) => item.id === value) ?? emptySelectedItem) : setSelectedItem(emptySelectedItem)}, [value]);
  useEffect(() => {items.length ? null : setInputValue(label ?? "")}, [label]);
  useEffect(() => {items.length ? setInputValue(selectedItem?.label ?? "") : null}, [selectedItem]);
  useEffect(() => {setSuggestions(localItems)}, []);

  const handleInputClick = async () => {
    isAutocomplete ? openMenu() : toggleMenu();
    if (requestItemsOnFirstTouch) {
      const newItems = await requestItemsOnFirstTouch();
      setLocalItems(newItems);
      setSuggestions(newItems);
    }
  }

  const handleInputFocus = async () => {
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
        setSuggestions(await requestItemsOnInputChange(e.target.value));
      }, 300);
      openMenu();
    } else {
      setSuggestions(localItems.filter((item) => item.label?.toLowerCase().includes(e.target.value?.toLowerCase())));
      openMenu();
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
        closeMenu();
        break;
      }
      case "Enter": {
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

  const handleDocumentMousedown = (e:MouseEvent) => {
    if (rootRef.current?.contains(e.target as Node)) return;
    closeMenu();
    setSuggestions(localItems ?? []);
    items.length ? setInputValue(selectedItem?.label ?? "") : setInputValue(label ?? "");
  }

  useEffect(() => {
    if (inputRef.current === document.activeElement) {
      document.addEventListener("mousedown", handleDocumentMousedown);
    }
    return () => document.removeEventListener("mousedown", handleDocumentMousedown);
  })

  return (
    <SelectContext.Provider value={{ isAutocomplete, disabled, value, suggestions, inputRef, inputValue, placeholder, selectedItem, handleInputChange, handleClearBtnClick, required, name, handleInputClick, handleInputFocus, handleInputKeydown, isMenuOpen, closeMenu }}>
      <div className={clsx(styles["select"], className, disabled && styles["select--disabled"])} style={style} ref={rootRef}>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

export const SelectContext = createContext<SelectContextType>({} as SelectContextType);