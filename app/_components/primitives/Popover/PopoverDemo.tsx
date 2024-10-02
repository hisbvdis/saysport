"use client";
import { PopoverContent, type PopoverProps, PopoverRoot, PopoverTrigger } from ".";


export default function PopoverDemo(props:PopoverProps) {
  return (
    <PopoverRoot {...props}>
      <PopoverTrigger>Open</PopoverTrigger>
      <PopoverContent>
        {props.children}
      </PopoverContent>
    </PopoverRoot>
  )
}