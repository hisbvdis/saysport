import { useState } from "react";


export function useDebounce() {
  const [ timeoutId, setTimeoutId ] = useState<NodeJS.Timeout>();

  return (func:any, delay:number) => {
    clearTimeout(timeoutId);
    const id = setTimeout(func, delay);
    setTimeoutId(id);
  }
}
