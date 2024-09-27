import clsx from "clsx";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { MenuRoot } from "../Menu";
import { type SelectContentProps, SelectContext } from ".";
import { PopoverRoot, PopoverContent } from "@/app/_components/ui/Popover";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function SelectMenu(props:SelectContentProps) {
  const { className, style, children } = props;
  const { isMenuOpen, closeMenu } = useContext(SelectContext);

  if (!isMenuOpen) return null;
  return (
    <PopoverRoot className={clsx(styles["select__content"], className)} style={style} isOpen={isMenuOpen} close={closeMenu}>
      <PopoverContent>
        <MenuRoot>
          {children}
        </MenuRoot>
      </PopoverContent>
    </PopoverRoot>
  )
}