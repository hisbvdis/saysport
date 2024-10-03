import { PopoverContent, PopoverRoot, PopoverTrigger, type PopoverPropsType } from ".";


export default function PopoverDemo(props:PopoverPropsType) {
  return (
    <PopoverRoot {...props}>
      <PopoverTrigger>
        <button type="button">Open</button>
      </PopoverTrigger>
      <PopoverContent>
        {props.children}
      </PopoverContent>
    </PopoverRoot>
  )
}