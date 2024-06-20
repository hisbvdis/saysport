"use client";
import { useSearchParams } from "next/navigation";


export const useManageSearchParams = () => {
  const searchParams = useSearchParams();

  return (action: Action, key:string, value?:string | string[] | null) => {
    value = String(value);
    let urlSearchParams = new URLSearchParams(searchParams);
    switch (action) {
      case "set": {
        urlSearchParams.set(key, value);
        break;
      }
      case "append": {
        const valueSet = new Set(urlSearchParams.get(key)?.split(","));
        valueSet.has(value) ? valueSet.delete(value) : valueSet.add(value);
        const valueString = [...Array.from(valueSet)].toSorted((a, b) => a > b ? 1 : -1).join(",");
        valueString === "" ? urlSearchParams.delete(key) : urlSearchParams.set(key, valueString);
        break;
      }
      case "delete": {
        if (Array.isArray(key)) {
          key.forEach((key) => urlSearchParams.delete(key));
        } else {
          urlSearchParams.delete(key);
        }
        break;
      }
      case "leaveOnly": {
        const currentValue = value ? value : urlSearchParams.get(key);
        urlSearchParams = new URLSearchParams();
        urlSearchParams.set(key, currentValue ?? "null");
        break;
      }
    }
    if (!value) urlSearchParams.delete(key);
    return decodeURIComponent(`?${urlSearchParams}`) || "?";
  }
}

type Action = "set" | "append" | "delete" | "leaveOnly";