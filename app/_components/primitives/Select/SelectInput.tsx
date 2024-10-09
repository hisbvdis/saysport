import cx from "classix";
import { use } from "react"
// -----------------------------------------------------------------------------
import { SelectContext, type SelectInputProps } from ".";
// -----------------------------------------------------------------------------


export default function SelectInput(props:SelectInputProps) {
  const { className, style } = props;
  const { isAutocomplete, disabled, inputRef, inputValue, placeholder, required, handleInputChange, name, handleInputClick, handleInputFocus, handleInputKeydown, styles } = use(SelectContext);

  return (
    <input
      className={cx(styles["select__input"], isAutocomplete && styles["select__input--isAutocomplete"], className)}
      style={style}
      type="text"
      disabled={disabled}
      readOnly={!isAutocomplete}
      ref={inputRef}
      value={inputValue ?? ""}
      placeholder={placeholder}
      onChange={handleInputChange}
      required={required}
      name={name}
      onClick={handleInputClick}
      onFocus={handleInputFocus}
      onKeyDown={handleInputKeydown}
    />
  )
}

