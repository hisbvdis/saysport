import { Children, cloneElement, use, type ReactElement } from "react";
// -----------------------------------------------------------------------------
import { PopoverContext, type PopoverTriggerPropsType } from ".";
// -----------------------------------------------------------------------------


export default function PopoverTrigger(props:PopoverTriggerPropsType) {
  const { children } = props;
  const { toggle, triggerRef } = use(PopoverContext);
  const element = Children.only(children);

  return cloneElement(
    element as ReactElement,
    {
      onClick: () => toggle(),
      ref: triggerRef,
    }
  )
}