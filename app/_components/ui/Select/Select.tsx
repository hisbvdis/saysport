"use client";
import clsx from "clsx";
import { ChangeEvent, ChangeEventHandler, useEffect, useRef, useState } from "react";
// -----------------------------------------------------------------------------
import { Menu } from "@/app/_components/ui/Menu";
import { Input } from "@/app/_components/ui/Input/";
import { Button } from "@/app/_components/ui/Button/";
import { ArrowDownIcon, CloseIcon } from "@/app/_components/icons/";
// -----------------------------------------------------------------------------
import { useDebounce } from "@/app/_utils/useDebounce";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function Select(props:Props) {
  const { requestItemsOnInputChange, requestItemsOnFirstTouch, requestMinInputLenght=3 } = props;
  const { onChange=(e=>e), onChangeData=(e=>e) } = props;
  const { placeholder, disabled, isAutocomplete } = props;
  const [ localItems, setLocalItems ] = useState(props.items ?? []);
  const [ suggestions, setSuggestions ] = useState(localItems);
  const [ selectedItem, setSelectedItem ] = useState<Item | undefined>(isAutocomplete ? {id: props.value ?? "", label: props.label ?? ""} : localItems?.find((item) => item.id === props.value));
  const [ inputValue, setInputValue ] = useState(selectedItem?.label);
  const [ isShowMenu, setIsShowMenu ] = useState(false);
  const debounce = useDebounce();
  const divRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);
  useEffect(() => {isAutocomplete ? null : setSelectedItem(localItems?.find((item) => item.id === props.value))}, [props.value]);
  useEffect(() => {selectRef.current?.dispatchEvent(new Event("change", {bubbles: true}))}, [selectedItem]);
  useEffect(() => {isAutocomplete ? null : setInputValue(selectedItem?.label)}, [selectedItem]);
  useEffect(() => {isAutocomplete ? setInputValue(props.label) : null}, [props.label]);

  const handleInputClick = async () => {
    isAutocomplete ? setIsShowMenu(true) : setIsShowMenu(!isShowMenu);
    if (requestItemsOnFirstTouch) {
      const newItems = await requestItemsOnFirstTouch("");
      setLocalItems(newItems);
      setSuggestions(newItems);
    }
  }

  const handleInputFocus = async () => {
    isAutocomplete && setIsShowMenu(true);
    if (requestItemsOnFirstTouch) {
      const newItems = await requestItemsOnFirstTouch("");
      setLocalItems(newItems);
      setSuggestions(newItems);
    }
  }

  const handleInputChange = async (e:ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
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
    if ((e.target as HTMLElement).closest("." + styles["select"]) === divRef.current) return;
    setIsShowMenu(false);
    setSuggestions(localItems ?? []);
    isAutocomplete ? setInputValue(props.label) : setInputValue(selectedItem?.label);
  }

  const handleClearBtnClick = () => {
    setInputValue("");
    setSelectedItem({id: "", label: ""});
    inputRef.current?.focus();
  }

  const handleMenuSelect = (index:number) => {
    const item = suggestions?.[index];
    setSelectedItem(item);
    onChangeData(item?.data);
    setSuggestions(localItems ?? []);
    setIsShowMenu(false);
  }

  const handleInputKeydown = (e:React.KeyboardEvent<HTMLElement>) => {
    if (!["Escape", "Tab", "Enter", "ArrowUp", "ArrowDown"].includes(e.code)) return;
    switch (e.code) {
      case "Escape":
      case "Tab": {
        isAutocomplete ? setInputValue(props.label) : setInputValue(selectedItem?.label);
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
        if (localItems?.length === 0 || !selectedItem || !selectedItem.index || selectedItem?.index === 0) return;
        const item = localItems?.[selectedItem?.index - 1];
        setSelectedItem(item);
        onChangeData(item?.data);
        break;
      }
      case "ArrowDown" : {
        if (isAutocomplete) return;
        if (isShowMenu) return;
        e.preventDefault();
        if (localItems?.length === 0 || !selectedItem || !selectedItem.index || selectedItem?.index === localItems?.length - 1) return;
        const item = localItems?.[selectedItem?.index + 1];
        setSelectedItem(item);
        onChangeData(item?.data);
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
          className={clsx(styles["select__input"], isAutocomplete && styles["select__input--isAutocomplete"])}
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeydown}
          onClick={handleInputClick}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={!isAutocomplete}
        />
        {isAutocomplete ? null :
          <Button className={clsx(styles["select__btn"], styles["select__btn--arrow"])} disabled={disabled} tabIndex={-1}>
            <ArrowDownIcon className={clsx("icon", disabled && "disabled")}/>
          </Button>
        }
        {isAutocomplete && props.value ?
          <Button className={styles["select__btn"]} onClick={handleClearBtnClick} disabled={disabled}>
            <CloseIcon className={clsx("icon", disabled && "disabled")}/>
          </Button>
        : null}
      </p>
      <select className={styles["select__nativeSelect"]} name={props.name} value={props.value || ""} onChange={onChange} ref={selectRef}>
        <option value={selectedItem?.id ?? ""}></option>
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
  value?: string | number | null;
  label?: string | null;
  items?: Item[];
  requestItemsOnInputChange?: (value:string) => Promise<Item[]>;
  requestItemsOnFirstTouch?: (value:string) => Promise<Item[]>;
  requestMinInputLenght?: number;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  onChangeData?: (data: any) => any;
  placeholder?: string;
  disabled?: boolean;
}

interface Item {
  id: string | number;
  label: string | null;
  index?: number;
  data?: any;
}