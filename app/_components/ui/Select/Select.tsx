"use client";
import clsx from "clsx";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
// -----------------------------------------------------------------------------
import { Menu } from "@/app/_components/ui/Menu";
import { Input } from "@/app/_components/ui/Input/";
import { Button } from "@/app/_components/ui/Button/";
// -----------------------------------------------------------------------------
import { useDebounce } from "@/app/_hooks/useDebounce";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";
import { ChevronDownIcon, Cross1Icon } from "@radix-ui/react-icons";


export default function Select(props:Props) {
  const { className } = props;
  const { requestItemsOnInputChange, requestItemsOnFirstTouch, requestMinInputLenght=3 } = props;
  const { onChange=(e=>e), onChangeData=(e=>e) } = props;
  const { placeholder, disabled, isAutocomplete, required } = props;
  const [ localItems, setLocalItems ] = useState(props.items ?? []);
  const [ suggestions, setSuggestions ] = useState(localItems);
  const [ selectedItem, setSelectedItem ] = useState<Item | undefined>(props.items?.length ? localItems?.find((item) => item.id === props.value) : {id: props.value ?? "", label: props.label ?? ""});
  const [ inputValue, setInputValue ] = useState(selectedItem?.label);
  const [ isShowMenu, setIsShowMenu ] = useState(false);
  const debounce = useDebounce();
  const divRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);
  useEffect(() => {!props.items?.length ? null : setSelectedItem(localItems?.find((item) => item.id === props.value))}, [props.value]);
  useEffect(() => {selectRef.current?.dispatchEvent(new Event("change", {bubbles: true}))}, [selectedItem]);
  useEffect(() => {!props.items?.length ? null : setInputValue(selectedItem?.label)}, [selectedItem]);
  useEffect(() => {!props.items?.length ? setInputValue(props.label) : null}, [props.label]);

  const handleInputClick = async () => {
    isAutocomplete ? setIsShowMenu(true) : setIsShowMenu(!isShowMenu);
    if (requestItemsOnFirstTouch) {
      const newItems = await requestItemsOnFirstTouch("");
      setLocalItems(newItems);
      setSuggestions(newItems);
    }
  }

  const handleInputFocus = async (e:React.FocusEvent) => {
    // if (e.relatedTarget && inputRef.current && e.relatedTarget !== inputRef.current) return;
    isAutocomplete && setIsShowMenu(true);
    if (requestItemsOnFirstTouch) {
      const newItems = await requestItemsOnFirstTouch("");
      setLocalItems(newItems);
      setSuggestions(newItems);
    }
  }

  const handleInputChange = async (e:ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setSuggestions([]);
    if (!e.target.value) {
      setIsShowMenu(false);
    }
    if (requestItemsOnInputChange) {
      if (e.target.value.length < requestMinInputLenght) return;
      debounce(async () => {
        setSuggestions(await requestItemsOnInputChange(e.target.value));
      }, 300);
      setIsShowMenu(true);
    } else {
      setSuggestions(localItems?.filter(({label}) => label?.toLowerCase().includes(e.target.value?.toLowerCase())));
      setIsShowMenu(true);
    }
  }

  const handleDocumentMousedown = (e:MouseEvent) => {
    if ((e.target as HTMLElement).closest(`.${styles["select"]}`) === divRef.current) return;
    setIsShowMenu(false);
    setSuggestions(localItems ?? []);
    !props.items?.length ? setInputValue(props.label) : setInputValue(selectedItem?.label);
  }

  const handleClearBtnClick = () => {
    setInputValue("");
    setSelectedItem({id: "", label: ""});
    onChangeData({});
    onChange({name: props.name ?? "", value: ""});
    inputRef.current?.focus();
  }

  const handleMenuSelect = (index:number) => {
    const item = suggestions?.[index];
    setSelectedItem(item);
    onChange({name: props.name ?? "", value: String(item.id)});
    onChangeData(item?.data);
    setSuggestions(localItems ?? []);
    setIsShowMenu(false);
    !props.items?.length ? setInputValue(props.label) : setInputValue(selectedItem?.label);
  }

  const handleInputKeydown = (e:React.KeyboardEvent<HTMLElement>) => {
    if (!["Escape", "Tab", "Enter", "ArrowUp", "ArrowDown"].includes(e.code)) return;
    switch (e.code) {
      case "Escape":
      case "Tab": {
        !props.items?.length ? setInputValue(props.label) : setInputValue(selectedItem?.label);
        setSuggestions(localItems ?? []);
        setIsShowMenu(false);
        break;
      }
      case "Enter": {
        (!isAutocomplete && !isShowMenu) && setIsShowMenu(true);
        break;
      }
      case "ArrowUp" : {
        if (isAutocomplete) return;
        if (isShowMenu) return;
        e.preventDefault();
        if (localItems?.length === 0 || !selectedItem) return;
        const selectedItemIndex = localItems.findIndex((item) => item.id === selectedItem?.id);
        if (selectedItemIndex === 0) return;
        const item = localItems?.[selectedItemIndex - 1];
        setSelectedItem(item);
        onChangeData(item?.data);
        onChange({name: props.name ?? "", value: String(item.id)});
        break;
      }
      case "ArrowDown" : {
        if (isAutocomplete) return;
        if (isShowMenu) return;
        e.preventDefault();
        if (localItems?.length === 0 || !selectedItem) return;
        const selectedItemIndex = localItems.findIndex((item) => item.id === selectedItem.id);
        if (selectedItemIndex === localItems?.length - 1) return;
        const item = localItems?.[selectedItemIndex + 1];
        setSelectedItem(item);
        onChangeData(item?.data);
        onChange({name: props.name ?? "", value: String(item.id)});
        break;
      }
    }
  }

  useEffect(() => {
    if (inputRef.current === document.activeElement) {
      document.addEventListener("mousedown", handleDocumentMousedown);
    }
    return () => document.removeEventListener("mousedown", handleDocumentMousedown);
  })

  if (requestItemsOnInputChange && requestItemsOnFirstTouch) {
    throw new Error("Only one type of 'request' function");
  }

  return (
    <div className={clsx(styles["select"], disabled && styles["select--disabled"])} ref={divRef}>
      <p className={styles["select__inputWrapper"]}>
        <Input
          className={clsx(styles["select__input"], isAutocomplete && styles["select__input--isAutocomplete"], className)}
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeydown}
          onClick={handleInputClick}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={!isAutocomplete}
          required={required}
        />
        {!isAutocomplete || (props.items?.length && !props.value) ?
          <Button className={clsx(styles["select__button"], styles["select__button--arrow"])} disabled={disabled} tabIndex={-1}>
            <ChevronDownIcon/>
          </Button>
        : null}
        {isAutocomplete && props.value ?
          <Button className={styles["select__button"]} onClick={handleClearBtnClick} disabled={disabled}>
            <Cross1Icon/>
          </Button>
        : null}
      </p>
      <select className={styles["select__nativeSelect"]} name={props.name} value={props.value || ""} onChange={(e) => e} ref={selectRef} tabIndex={-1}>
        <option value={selectedItem?.id ?? ""}/>
      </select>
      <Menu
        isShowMenu={isShowMenu}
        value={props.value ?? ""}
        items={suggestions.map((item) => ({id: item.id, label: item.label}))}
        onSelect={handleMenuSelect}
      />
    </div>
  )
}

interface Props {
  isAutocomplete?: boolean;
  name?: string;
  value?: string | null;
  label?: string | null;
  items?: Item[];
  requestItemsOnInputChange?: (value:string) => Promise<Item[]>;
  requestItemsOnFirstTouch?: (value:string) => Promise<Item[]>;
  requestMinInputLenght?: number;
  onChange?: (data:{name:string, value:string}) => void;
  onChangeData?: (data: any) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

interface Item {
  id: string | number;
  label: string | null;
  data?: any;
}