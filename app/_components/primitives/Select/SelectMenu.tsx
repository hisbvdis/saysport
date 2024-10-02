import clsx from "clsx";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { type SelectMenuProps, SelectContext } from ".";
import { MenuRoot } from "@/app/_components/primitives/Menu";
import { PopoverContent, PopoverRoot } from "@/app/_components/primitives/Popover";
// -----------------------------------------------------------------------------


export default function SelectMenu(props:SelectMenuProps) {
  const { children, className, style } = props;
  const { isMenuOpen, closeMenu, suggestions, value, handleMenuSelect, styles, selectRootRef, onMenuCLose } = useContext(SelectContext);

  return (
    <PopoverRoot className={clsx(styles["select__menu"], className)} style={style} isOpen={isMenuOpen} closePopover={closeMenu} onClose={() => {onMenuCLose()}} shouldPushHistoryState nonCloseParent={selectRootRef.current}>
      <PopoverContent>
        <MenuRoot items={suggestions} value={value ?? ""} onSelect={handleMenuSelect}>
          {children}
        </MenuRoot>
      </PopoverContent>
    </PopoverRoot>
  )
}