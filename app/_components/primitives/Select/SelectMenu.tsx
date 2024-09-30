import clsx from "clsx";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { MenuRoot } from "@/app/_components/ui/Menu";
import { type SelectContentProps, SelectContext } from ".";
import { PopoverContent, PopoverRoot } from "@/app/_components/ui/Popover";
// -----------------------------------------------------------------------------


export default function SelectMenu(props:SelectContentProps) {
  const { className, style, children } = props;
  const { isMenuOpen, closeMenu, suggestions, value, handleMenuSelect, styles } = useContext(SelectContext);

  if (!isMenuOpen || !suggestions.length) return null;
  return (
    <PopoverRoot className={clsx(styles["select__menu"], className)} style={style} isOpen={isMenuOpen} popover="manual">
      <PopoverContent>
        <MenuRoot items={suggestions} isOpen={isMenuOpen} value={value ?? ""} onSelect={handleMenuSelect} close={closeMenu}>
          {children}
        </MenuRoot>
      </PopoverContent>
    </PopoverRoot>
  )
}