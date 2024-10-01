import clsx from "clsx";
import { useContext } from "react"
// -----------------------------------------------------------------------------
import { SelectContext, type SelectInputProps } from ".";
// -----------------------------------------------------------------------------


export default function SelectInput(props:SelectInputProps) {
  const { className, style } = props;
  const { isAutocomplete, disabled, inputRef, inputValue, placeholder, required, handleInputChange, name, handleInputClick, handleInputFocus, handleInputKeydown, styles } = useContext(SelectContext);

  return (
    <input
      className={clsx(styles["select__input"], isAutocomplete && styles["select__input--isAutocomplete"], className)}
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

