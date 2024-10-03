"use client";
import cx from "classix";
import { type ChangeEvent, type ReactEventHandler, createContext, useContext, useId } from "react"
// -----------------------------------------------------------------------------
import { ControlContext } from "../Control";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export const CheckboxGroup = (props:Props) => <ChoiceGroup {...props}/>
export const RadioGroup = (props:Props) => <ChoiceGroup {...props}/>

function ChoiceGroup(props:Props) {
  const controlContext = useContext(ControlContext);
  const { valueToCompareWith, arrayToCompareWith } = props;
  const innerGroupName = useId();
  const groupName = props.name ?? innerGroupName;
  const { onChange=(e=>e) } = props;
  const { className, style, children } = props;
  const labelId = controlContext?.labelId;
  const requiredGroup = props.required ?? controlContext?.required ?? false;
  const disabledGroup = props.disabled ?? false;

  return (
    <ChoiceGroupContext.Provider value={{groupName, onChange, valueToCompareWith, arrayToCompareWith, requiredGroup, disabledGroup}}>
      <fieldset
        className={cx(styles["choiceGroup"], className)}
        style={style}
        aria-labelledby={labelId}
      >
        {children}
      </fieldset>
    </ChoiceGroupContext.Provider>
  )
}

export const ChoiceGroupContext = createContext<ChoiceGroupContextType>({} as ChoiceGroupContextType);

interface Props {
  name?: string;
  valueToCompareWith?: string | boolean;
  arrayToCompareWith?: string[];
  onChange?: (e:ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
}

interface ChoiceGroupContextType {
  groupName: string;
  onChange: ReactEventHandler;
  valueToCompareWith?: string | boolean;
  arrayToCompareWith?: string[];
  requiredGroup: boolean;
  disabledGroup: boolean;
}