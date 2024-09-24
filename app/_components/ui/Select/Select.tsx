import type { SelectRootProps } from "./SelectTypes";
import { ChevronDownIcon, Cross1Icon } from "@radix-ui/react-icons";
// -----------------------------------------------------------------------------
import SelectRoot from "./SelectRoot";
import SelectContent from "./SelectContent";
import SelectTrigger from "./SelectTrigger";
// -----------------------------------------------------------------------------


export default function Select(props:SelectRootProps) {
  return (
    <SelectRoot {...props}>
      <SelectTrigger>
        <SelectTrigger.Input/>
        <SelectTrigger.ArrowIcon>
          <ChevronDownIcon/>
        </SelectTrigger.ArrowIcon>
        <SelectTrigger.CloseButton>
          <Cross1Icon/>
        </SelectTrigger.CloseButton>
      </SelectTrigger>
      <SelectContent>

      </SelectContent>
    </SelectRoot>
  )
}