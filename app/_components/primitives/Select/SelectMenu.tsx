import cx from "classix";
import { use } from "react";
// -----------------------------------------------------------------------------
import { Popover } from "@/app/_components/ui/Popover";
import { type SelectMenuProps, SelectContext } from ".";
import { MenuRoot } from "@/app/_components/primitives/Menu";
// -----------------------------------------------------------------------------


export default function SelectMenu(props:SelectMenuProps) {
  const { className, style, children } = props;
  const { isMenuOpen, value, handleMenuSelect, styles, selectRootRef, onMenuCLose } = use(SelectContext);

  return (<>
    {isMenuOpen && (
      <Popover className={cx(styles["select__menu"], className)} style={style} onClose={() => {onMenuCLose()}} shouldPushHistoryState="mobile" nonClosingElem={selectRootRef.current}>
        <MenuRoot value={value ?? ""} onSelect={handleMenuSelect}>
          {children}
        </MenuRoot>
      </Popover>
    )}
  </>)
}