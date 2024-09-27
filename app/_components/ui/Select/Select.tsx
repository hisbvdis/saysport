"use client";
import { useState } from "react";
import { ChevronDownIcon, Cross1Icon } from "@radix-ui/react-icons";
import { SelectArrowIcon, SelectCloseButton, SelectInput, type SelectItem, SelectMenu, SelectOption, type SelectProps, SelectRoot, SelectTrigger, SelectValue } from ".";


export default function Select(props:SelectProps) {
  const [ suggestions, setSuggestions ] = useState<SelectItem[]>([]);

  return (
    <SelectRoot {...props} setSuggestions={setSuggestions} suggestions={suggestions}>

      <SelectTrigger>
        <SelectInput/>
        <SelectArrowIcon><ChevronDownIcon/></SelectArrowIcon>
        <SelectCloseButton><Cross1Icon/></SelectCloseButton>
      </SelectTrigger>

      <SelectMenu>
        {suggestions?.map((item) => (
          <SelectOption key={item.id}>
            <SelectValue>{item.label}</SelectValue>
          </SelectOption>
        ))}
      </SelectMenu>

    </SelectRoot>
  )
}