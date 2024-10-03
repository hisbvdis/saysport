"use client";
import cx from "classix";
import { useState } from "react";
import { ChevronDownIcon, Cross1Icon } from "@radix-ui/react-icons";
// -----------------------------------------------------------------------------
import { SelectArrowIcon, SelectCloseButton, SelectInput, type SelectItemType, SelectMenu, SelectItem, type SelectProps, SelectRoot, SelectTrigger, SelectItemText } from "@/app/_components/primitives/Select/";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function Select(props:SelectProps) {
  const [ suggestions, setSuggestions ] = useState<SelectItemType[]>([]);

  return (
    <SelectRoot {...props} className={cx(props.className, styles["select__root"])} setSuggestions={setSuggestions} suggestions={suggestions}>

      <SelectTrigger>
        <SelectInput/>
        <SelectArrowIcon><ChevronDownIcon/></SelectArrowIcon>
        <SelectCloseButton><Cross1Icon/></SelectCloseButton>
      </SelectTrigger>

      <SelectMenu>
        {suggestions?.map((item, i) => (
          <SelectItem key={item.id} itemIndex={i}>
            <SelectItemText>{item.label}</SelectItemText>
          </SelectItem>
        ))}
      </SelectMenu>

    </SelectRoot>
  )
}