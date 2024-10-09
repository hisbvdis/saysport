"use client";
import { ChevronDownIcon, Cross1Icon } from "@radix-ui/react-icons";
// -----------------------------------------------------------------------------
import { SelectArrowIcon, SelectCloseButton, SelectInput, SelectMenu, type SelectProps, SelectRoot, SelectTrigger } from "@/app/_components/primitives/Select/";
// -----------------------------------------------------------------------------


export default function Select(props:SelectProps) {
  return (
    <SelectRoot {...props}>
      <SelectTrigger>
        <SelectInput/>
        <SelectArrowIcon><ChevronDownIcon/></SelectArrowIcon>
        <SelectCloseButton><Cross1Icon/></SelectCloseButton>
      </SelectTrigger>
      <SelectMenu/>
    </SelectRoot>
  )
}