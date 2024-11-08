"use client";
import cx from "classix";
import { type ChangeEventHandler, type FocusEventHandler, type KeyboardEventHandler, type MouseEventHandler, createElement, forwardRef, use, useRef, useState } from "react";
// -----------------------------------------------------------------------------
import { ControlContext } from "../Control";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export const Input = forwardRef<HTMLInputElement, Props>(function Input(props, inputRefForwarded) {
  const controlContext = use(ControlContext);
  const [ changed, setChanged ] = useState(false);
  const name = props.name ?? "";
  const value = (typeof props.value === "number" || typeof props.value === "string") ? String(props.value) : "";
  const required = props.required ?? controlContext?.required;
  const labelId = controlContext?.labelId;
  const inputRefInner = useRef(null);
  const inputRef = inputRefForwarded ?? inputRefInner;
  const id = props.id ?? controlContext?.inputId;
  const { onChange=(e=>e), onChangeValue=(e=>e) } = props;
  const { onFocus=(e=>e), onBlur=(e=>e), onBlurIfChanged=(e=>e) } = props;
  const { onClick=(e=>e), onKeyDown=(e=>e) } = props;
  const { type="text", pattern, readOnly, maxLength, disabled, placeholder, size="20" } = props;
  const { className, style } = props;

  return createElement(
    type === "textarea" ? "textarea" : "input",
    {
      "aria-labelledby": labelId,
      className: cx(styles["input"], type === "textarea" && styles["input--textarea"], className),
      disabled: disabled,
      id: id,
      maxLength: maxLength,
      name: name,
      onBlur: (e:React.FocusEvent<HTMLInputElement>) => {onBlur(e);if(changed)onBlurIfChanged(e);setChanged(false)},
      onChange: (e:React.ChangeEvent<HTMLInputElement>) => {onChange(e);onChangeValue(e.target.value);if(!changed)setChanged(true)},
      onClick: (e:React.MouseEvent) => {onClick(e)},
      onFocus: (e:React.FocusEvent) => {onFocus(e)},
      onKeyDown: (e:React.KeyboardEvent) => {onKeyDown(e)},
      pattern: pattern,
      placeholder: placeholder,
      readOnly: readOnly,
      ref: inputRef,
      required: required,
      style: style,
      type: type,
      value: value,
      size: size,
    }
  )
})

export const Textarea = (props:Props) => <Input {...props} type="textarea"/>

interface Props {
  className?: string;
  disabled?: boolean;
  id?: string;
  maxLength?: string;
  name?: string;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onBlurIfChanged?: FocusEventHandler<HTMLInputElement>;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onChangeValue?: (value:string) => void;
  onClick?: MouseEventHandler;
  onFocus?: FocusEventHandler;
  onKeyDown?: KeyboardEventHandler;
  pattern?: string;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  style?: React.CSSProperties;
  type?: "input" | "textarea" | "number";
  value?: string | number | undefined | null;
  size?: string;
}