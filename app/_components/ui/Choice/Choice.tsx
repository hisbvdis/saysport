"use client";
import clsx from "clsx";
import { ChangeEventHandler, useContext, useId, useRef } from "react"
// -----------------------------------------------------------------------------
import { RequiredInput } from "../RequiredInput";
// -----------------------------------------------------------------------------
import { ChoiceGroupContext } from "./ChoiceGroup";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export const Radio = (props:Props) => <Choice {...props} type="radio"/>
export const Checkbox = (props:Props) => <Choice {...props} type="checkbox"/>

function Choice(props:Props) {
  const choiceGroupContext = useContext(ChoiceGroupContext);
  const inputRef = useRef(null);
  const inputId = useId();
  const type = props.type;
  const name = props.name ?? choiceGroupContext?.groupName ?? "";
  const value = props.value ?? "";
  const valueToCompareWith = props.valueToCompareWith ?? choiceGroupContext?.valueToCompareWith ?? "";
  const arrayToCompareWith = props.arrayToCompareWith ?? choiceGroupContext?.arrayToCompareWith ?? "";
  const checked = props.checked ?? (valueToCompareWith ? value === valueToCompareWith : arrayToCompareWith.includes(value));
  const requiredSelf = props.required ?? false;
  const requiredGroup = choiceGroupContext?.requiredGroup ?? false;
  const { tabIndex=0 } = props;
  const { className, style, children } = props;
  const disabled = props.disabled ?? choiceGroupContext?.disabledGroup ?? false;
  const onChange = props.onChange ?? choiceGroupContext?.onChange ?? (e=>e);

  return (
    <label className={clsx(styles["choice"], className)} style={style}>
      <input
        className={styles["choice__input"]}
        id={inputId}
        type={type}
        ref={inputRef}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        required={requiredSelf}
        tabIndex={tabIndex}
        disabled={disabled}
      />
      {requiredGroup && type === "checkbox" ? <RequiredInput name={name} checked={checked} isValidIf={requiredSelf}/> : ""}
      <span className={styles["choice__label"]}>{children}</span>
    </label>
  )
}

interface Props {
  type?: "radio" | "checkbox";
  name?: string;
  value?: string;
  valueToCompareWith?: string;
  arrayToCompareWith?: string[];
  checked?: boolean;
  required?: boolean;
  tabIndex?: number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
}