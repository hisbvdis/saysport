"use client";
import cx from "classix";
import { ChevronDownIcon, Cross1Icon } from "@radix-ui/react-icons";
// -----------------------------------------------------------------------------
import { SelectArrowIcon, SelectCloseButton, SelectInput, SelectMenu, type SelectProps, SelectRoot, SelectTrigger } from "@/app/_components/primitives/Select/";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function Select(props:SelectProps) {
  return (
    <SelectRoot {...props} className={cx(props.className, styles["outer-class"])}>
      <SelectTrigger>
        <SelectInput/>
        <SelectArrowIcon><ChevronDownIcon/></SelectArrowIcon>
        <SelectCloseButton><Cross1Icon/></SelectCloseButton>
      </SelectTrigger>
      <SelectMenu/>
    </SelectRoot>
  )
}