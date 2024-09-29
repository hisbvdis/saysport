import { PopoverContent, type PopoverProps, PopoverRoot } from ".";

export default function Popover(props:PopoverProps) {
  const { children } = props;

  return (
    <PopoverRoot {...props}>
      <PopoverContent>
        {children}
      </PopoverContent>
    </PopoverRoot>
  )
}