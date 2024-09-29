"use client";
import clsx from "clsx";
import { ChevronDownIcon, Cross1Icon } from "@radix-ui/react-icons";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
// -----------------------------------------------------------------------------
import { MenuOld } from "@/app/_components/ui/MenuOld";
import { Input } from "@/app/_components/ui/Input/";
import { Button } from "@/app/_components/ui/Button/";
// -----------------------------------------------------------------------------
import { useDebounce } from "@/app/_hooks/useDebounce";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function SelectOld(props:Props) {
  /* [V] */const { className } = props;
  /* [V] */const { requestItemsOnInputChange, requestItemsOnFirstTouch, requestMinInputLenght=3 } = props;
  /* [V] */const { onChange=(e=>e) } = props;
  /* [V] */const { onChangeData=(e=>e) } = props;
  /* [V] */const { placeholder, disabled, isAutocomplete, required } = props;
  /* [V] */const [ localItems, setLocalItems ] = useState(props.items ?? []);
  /* [V] */const [ suggestions, setSuggestions ] = useState(localItems);
  /* [V] */const [ selectedItem, setSelectedItem ] = useState<Item | undefined>(props.items?.length ? localItems?.find((item) => item.id === props.value) : {id: props.value ?? "", label: props.label ?? ""});
  /* [V] */const [ inputValue, setInputValue ] = useState(selectedItem?.label);
  /* [V] */const [ isShowMenu, setIsShowMenu ] = useState(false);
  /* [V] */const debounce = useDebounce();
  const divRef = useRef<HTMLDivElement>(null);
  /* [V] */const inputRef = useRef<HTMLInputElement>(null);
  /* [x] */const selectRef = useRef<HTMLSelectElement>(null);
  /* [V] */useEffect(() => {!props.items?.length ? null : setSelectedItem(localItems?.find((item) => item.id === props.value))}, [props.value]);
  /* [V] */useEffect(() => {!props.items?.length ? setInputValue(props.label) : null}, [props.label]);
  /* [V] */useEffect(() => {!props.items?.length ? null : setInputValue(selectedItem?.label)}, [selectedItem]);
  /* [X] */useEffect(() => {selectRef.current?.dispatchEvent(new Event("change", {bubbles: true}))}, [selectedItem]);

  /* [V] */const handleInputClick = async () => {
    /* [V] */isAutocomplete ? setIsShowMenu(true) : setIsShowMenu(!isShowMenu);
    /* [V] */if (requestItemsOnFirstTouch) {
    /* [V] */  const newItems = await requestItemsOnFirstTouch("");
    /* [V] */  setLocalItems(newItems);
    /* [V] */  setSuggestions(newItems);
    /* [V] */}
  /* [V] */}

  /* [V] */const handleInputFocus = async (e:React.FocusEvent) => {
    // if (e.relatedTarget && inputRef.current && e.relatedTarget !== inputRef.current) return;
    /* [V] */isAutocomplete && setIsShowMenu(true);
    /* [V] */if (requestItemsOnFirstTouch) {
    /* [V] */  const newItems = await requestItemsOnFirstTouch("");
    /* [V] */  setLocalItems(newItems);
    /* [V] */  setSuggestions(newItems);
    /* [V] */}
  /* [V] */}

  /* [V] */const handleInputChange = async (e:ChangeEvent<HTMLInputElement>) => {
    /* [V] */setInputValue(e.target.value);
    /* [V] */setSuggestions([]);
    /* [V] */if (!e.target.value) {
    /* [V] */  setIsShowMenu(false);
    /* [V] */}
    /* [V] */if (requestItemsOnInputChange) {
    /* [V] */  if (e.target.value.length < requestMinInputLenght) return;
    /* [V] */  debounce(async () => {
    /* [V] */    setSuggestions(await requestItemsOnInputChange(e.target.value));
    /* [V] */  }, 300);
    /* [V] */  setIsShowMenu(true);
    /* [V] */} else {
    /* [V] */  setSuggestions(localItems?.filter(({label}) => label?.toLowerCase().includes(e.target.value?.toLowerCase())));
    /* [V] */  setIsShowMenu(true);
    /* [V] */}
  /* [V] */}

  /* [V] */const handleDocumentMousedown = (e:MouseEvent) => {
  /* [V] */  if ((e.target as HTMLElement).closest(`.${styles["select"]}`) === divRef.current) return;
  /* [V] */  setIsShowMenu(false);
  /* [V] */  setSuggestions(localItems ?? []);
  /* [V] */  !props.items?.length ? setInputValue(props.label) : setInputValue(selectedItem?.label);
  /* [V] */}

  const handleClearBtnClick = () => {
    setInputValue("");
    /* [V] */setSelectedItem({id: "", label: ""});
    onChangeData({});
    /* [V] */onChange({name: props.name ?? "", value: ""});
    /* [V] */inputRef.current?.focus();
  }

  const handleMenuSelect = (index:number) => {
    /* [V] */const item = suggestions?.[index];
    setSelectedItem(item);
    /* [V] */onChange({name: props.name ?? "", value: String(item.id)});
    /* [V] */onChangeData(item?.data);
    setSuggestions(localItems ?? []);
    setIsShowMenu(false);
    !props.items?.length ? setInputValue(props.label) : setInputValue(selectedItem?.label);
  }

  /* [V] */const handleInputKeydown = (e:React.KeyboardEvent<HTMLElement>) => {
    /* [V] */if (!["Escape", "Tab", "Enter", "ArrowUp", "ArrowDown"].includes(e.code)) return;
    /* [V] */switch (e.code) {
      /* [V] */case "Escape":
      /* [V] */case "Tab": {
      /* [V] */  !props.items?.length ? setInputValue(props.label) : setInputValue(selectedItem?.label);
      /* [V] */  setSuggestions(localItems ?? []);
      /* [V] */  setIsShowMenu(false);
      /* [V] */  break;
      /* [V] */}
      /* [V] */case "Enter": {
      /* [V] */e.preventDefault();
      /* [V] */  (!isAutocomplete && !isShowMenu) && setIsShowMenu(true);
      /* [V] */  break;
      /* [V] */}
      /* [V] */case "ArrowUp" : {
        /* [V] */if (isAutocomplete) return;
        /* [V] */if (isShowMenu) return;
        /* [V] */e.preventDefault();
        /* [V] */if (localItems?.length === 0 || !selectedItem) return;
        /* [V] */const selectedItemIndex = localItems.findIndex((item) => item.id === selectedItem?.id);
        /* [V] */if (selectedItemIndex === 0) return;
        /* [V] */const item = localItems?.[selectedItemIndex - 1];
        /* [V] */setSelectedItem(item);
        onChangeData(item?.data);
        /* [V] */onChange({name: props.name ?? "", value: String(item.id)});
        /* [V] */break;
      }
      /* [V] */case "ArrowDown" : {
        /* [V] */if (isAutocomplete) return;
        /* [V] */if (isShowMenu) return;
        /* [V] */e.preventDefault();
        /* [V] */if (localItems?.length === 0 || !selectedItem) return;
        /* [V] */const selectedItemIndex = localItems.findIndex((item) => item.id === selectedItem.id);
        /* [V] */if (selectedItemIndex === localItems?.length - 1) return;
        /* [V] */const item = localItems?.[selectedItemIndex + 1];
        /* [V] */setSelectedItem(item);
        onChangeData(item?.data);
        /* [V] */onChange({name: props.name ?? "", value: String(item.id)});
        /* [V] */break;
      /* [V] */}
    /* [V] */}
  /* [V] */}

  /* [V] */useEffect(() => {
  /* [V] */  if (inputRef.current === document.activeElement) {
  /* [V] */    document.addEventListener("mousedown", handleDocumentMousedown);
  /* [V] */  }
  /* [V] */  return () => document.removeEventListener("mousedown", handleDocumentMousedown);
  /* [V] */})

  if (requestItemsOnInputChange && requestItemsOnFirstTouch) {
    throw new Error("Only one type of 'request' function");
  }

  return (
    <div className={clsx(styles["select"], className, disabled && styles["select--disabled"])} ref={divRef}>
      {/* [V] */}<p className={styles["select__inputWrapper"]}>
        <Input
          /* [V] */className={clsx(styles["select__input"], isAutocomplete && styles["select__input--isAutocomplete"])}
          /* [V] */ref={inputRef}
          /* [V] */value={inputValue}
          /* [V] */onChange={handleInputChange}
          /* [V] */onKeyDown={handleInputKeydown}
          /* [V] */onClick={handleInputClick}
          /* [V] */onFocus={handleInputFocus}
          /* [V] */placeholder={placeholder}
          /* [V] */disabled={disabled}
          /* [V] */readOnly={!isAutocomplete}
          /* [V] */required={required}
        />
        {/* [V] */}{!isAutocomplete || (props.items?.length && !props.value) ?
        /* [V] */  <Button className={clsx(styles["select__button"], styles["select__button--arrow"])} disabled={disabled} tabIndex={-1}>
        {/* [V] */}    <ChevronDownIcon/>
        {/* [V] */}  </Button>
        /* [V] */: null}
        {/* [V] */}{isAutocomplete && props.value ?
        /* [V] */  <Button className={styles["select__button"]} onClick={handleClearBtnClick} disabled={disabled}>
        {/* [V] */}    <Cross1Icon/>
        {/* [V] */}  </Button>
        /* [V] */: null}
      {/* [V] */}</p>
      {/* [X] */}<select className={styles["select__nativeSelect"]} name={props.name} value={props.value || ""} onChange={(e) => e} ref={selectRef} tabIndex={-1}>
      {/* [X] */}  <option value={selectedItem?.id ?? ""}/>
      {/* [X] */}</select>
      <MenuOld
        isShowMenu={isShowMenu}
        value={props.value ?? ""}
        items={suggestions.map((item) => ({id: item.id, label: item.label}))}
        onSelect={handleMenuSelect}
      />
    </div>
  )
}

/* [V] */interface Props {
  /* [V] */isAutocomplete?: boolean;
  /* [V] */name?: string;
  /* [V] */value?: string | null;
  /* [V] */label?: string | null;
  /* [V] */items?: Item[];
  /* [V] */requestItemsOnInputChange?: (value:string) => Promise<Item[]>;
  /* [V] */requestItemsOnFirstTouch?: (value:string) => Promise<Item[]>;
  /* [V] */requestMinInputLenght?: number;
  /* [V] */onChange?: (data:{name:string, value:string}) => void;
  onChangeData?: (data: any) => void;
  /* [V] */placeholder?: string;
  /* [V] */disabled?: boolean;
  /* [V] */required?: boolean;
  /* [V] */className?: string;
/* [V] */}

/* [V] */interface Item {
/* [V] */  id: string | number;
/* [V] */  label: string | null;
/* [V] */  data?: any;
/* [V] */}