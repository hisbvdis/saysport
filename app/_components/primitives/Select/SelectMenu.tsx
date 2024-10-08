import cx from "classix";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { MenuRoot } from "@/app/_components/primitives/Menu";
import { PopoverContent, PopoverRoot } from "@/app/_components/primitives/Popover";
import { type SelectMenuProps, SelectContext, SelectItem, SelectItemText } from ".";
// -----------------------------------------------------------------------------


export default function SelectMenu(props:SelectMenuProps) {
  const { className, style } = props;
  const { isMenuOpen, suggestions, value, handleMenuSelect, styles, selectRootRef, onMenuCLose } = useContext(SelectContext);

  return (
    <PopoverRoot className={cx(styles["select__menu"], className)} style={style} isOpen={isMenuOpen} onClose={() => {onMenuCLose()}} shouldPushHistoryState="mobile" nonClosingParent={selectRootRef.current}>
      <PopoverContent>
        <MenuRoot items={suggestions} value={value ?? ""} onSelect={handleMenuSelect} isOpen={isMenuOpen}>
          {suggestions?.map((item, i) => (
            <SelectItem key={item.id} itemIndex={i}>
              <SelectItemText>{item.label}</SelectItemText>
            </SelectItem>
          ))}
        </MenuRoot>
      </PopoverContent>
    </PopoverRoot>
  )
}