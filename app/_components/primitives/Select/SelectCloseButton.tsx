import cx from "classix";
import { use } from "react";
// -----------------------------------------------------------------------------
import { SelectContext, type SelectCloseButtonProps } from ".";
// -----------------------------------------------------------------------------


export default function SelectCloseButton(props:SelectCloseButtonProps) {
  const { children, className, style } = props;
  const { isAutocomplete, selectedItem, handleClearBtnClick, disabled, styles } = use(SelectContext);

  if (!isAutocomplete || !selectedItem?.id) return null;
  return (
    <button
      className={cx(styles["select__closeButton"], className)}
      type="button"
      style={style}
      onClick={handleClearBtnClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}