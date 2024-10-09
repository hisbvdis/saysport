import { MenuItem, MenuItemText, MenuRoot, type MenuPropsType } from ".";


export default function MenuDemo(props:MenuPropsType) {
  return (
    <MenuRoot {...props}>
      {props.items?.map((item, i) => (
        <MenuItem key={item.id} itemIndex={i}>
          <MenuItemText>{item.label}</MenuItemText>
        </MenuItem>
      ))}
    </MenuRoot>
  )
}