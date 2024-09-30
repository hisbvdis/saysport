import { PopoverContent, type PopoverDemoProps, PopoverRoot, PopoverTrigger } from ".";

export default function PopoverDemo(props:PopoverDemoProps) {
  const { children } = props;

  return (
    <PopoverRoot {...props}>
      <PopoverTrigger>Open</PopoverTrigger>
      <PopoverContent>
        {children}
      </PopoverContent>
    </PopoverRoot>
  )
}