"use client";
import { useState } from "react";


export function useDisclosure(defaultValue=false) {
  const [ isOpen, setIsOpen ] = useState<boolean>(defaultValue);
  const close = () => setIsOpen(false);
  const open = () => setIsOpen(true);
  const toggle = () => setIsOpen(!isOpen);

  return { isOpen, open, close, toggle };
}
