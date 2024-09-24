"use client";
import clsx from "clsx";
import { useContext } from "react"
import type { SelectInputProps } from "./SelectTypes";
// -----------------------------------------------------------------------------
import { SelectContext } from "./SelectRoot"
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function SelectInput(props:SelectInputProps) {
  const {className, style} = props;
  const {isAutocomplete, disabled, inputRef, inputValue, placeholder, required, handleInputChange, name, handleInputClick, handleInputFocus, handleInputKeydown} = useContext(SelectContext);

  return (
    <input
      className={clsx(styles["select__input"], isAutocomplete && styles["select__input--isAutocomplete"], className)}
      style={style}
      type="text"
      disabled={disabled}
      readOnly={!isAutocomplete}
      ref={inputRef}
      value={inputValue ?? ""}
      placeholder={placeholder}
      onChange={handleInputChange}
      required={required}
      name={name}
      onClick={handleInputClick}
      onFocus={handleInputFocus}
      onKeyDown={handleInputKeydown}
    />
  )
}