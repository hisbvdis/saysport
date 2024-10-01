import clsx from "clsx";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { MenuRoot } from "@/app/_components/ui/Menu";
import { type SelectMenuProps, SelectContext } from ".";
import { PopoverContent, PopoverRoot } from "@/app/_components/ui/Popover";
// -----------------------------------------------------------------------------


export default function SelectMenu(props:SelectMenuProps) {
  const { children, className, style } = props;
  const { isMenuOpen, closeMenu, suggestions, value, handleMenuSelect, styles } = useContext(SelectContext);

  if (!isMenuOpen || !suggestions.length) return null;
  return (
    <PopoverRoot className={clsx(styles["select__menu"], className)} style={style} isOpen={isMenuOpen} popover="manual" closePopover={closeMenu}>
      <PopoverContent>
        <MenuRoot items={suggestions} value={value ?? ""} onSelect={handleMenuSelect}>
          {children}
        </MenuRoot>
      </PopoverContent>
    </PopoverRoot>
  )
}