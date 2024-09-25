import { useDisclosure } from "@/app/_hooks/useDisclosure";
import PopoverContent from "./PopoverContent";
import PopoverRoot from "./PopoverRoot";

export default function Popover() {
  const { open, close, isOpen } = useDisclosure();

  return (<>
    <button type="button" onClick={open}>Open</button>
    <PopoverRoot isOpen={isOpen} close={close}>
      <PopoverContent>
        <h1>Hello worlds</h1>
      </PopoverContent>
    </PopoverRoot>
  </>)
}

