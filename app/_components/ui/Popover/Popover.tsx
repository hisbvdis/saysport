import { PopoverRoot, PopoverContent, type PopoverPropsType } from "@/app/_components/primitives/Popover/";


export default function Popover(props:PopoverPropsType) {
  return (
    <PopoverRoot {...props}>
      <PopoverContent>
        {props.children}
      </PopoverContent>
    </PopoverRoot>
  )
}