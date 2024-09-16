"use client";
import { useState } from "react";


export function useDisclosure(defaultValue:boolean) {
  const [ isOpen, setIsOpen ] = useState<boolean>(defaultValue);
  const close = () => setIsOpen(false);
  const open = () => setIsOpen(true);

  return { isOpen, open, close };
}
