import clsx from "clsx";
import { useContext } from "react";
import { type SelectContentProps, SelectContext } from ".";
// -----------------------------------------------------------------------------
import { MenuRoot } from "../Menu";
import { Popover } from "@/app/_components/ui/Popover";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function SelectMenu(props:SelectContentProps) {
  const { className, style, children } = props;
  const { isMenuOpen, onChange, closeMenu, suggestions, value, handleMenuSelect } = useContext(SelectContext);

  if (!isMenuOpen || !suggestions.length) return null;
  return (
    <Popover className={clsx(styles["select__menu"], className)} style={style} isOpen={isMenuOpen} popover="manual">
      <MenuRoot items={suggestions} isOpen={isMenuOpen} value={value ?? ""} onSelect={handleMenuSelect} close={closeMenu}>
        {children}
      </MenuRoot>
    </Popover>
  )
}