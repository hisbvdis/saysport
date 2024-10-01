export default function MenuDemo() {
  return (
    <PopoverRoot className={clsx(styles["select__menu"], className)} style={style} isOpen={isMenuOpen} popover="manual">
      <PopoverContent>
        <MenuRoot items={suggestions} value={value ?? ""} onSelect={handleMenuSelect} close={closeMenu}>
          {children}
        </MenuRoot>
      </PopoverContent>
    </PopoverRoot>
  )
}