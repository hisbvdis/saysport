"use client";
import { useSearchParams } from "next/navigation";


export const useManageSearchParams = () => {
  const searchParams = useSearchParams();

  return {
    set: (key:string, value:string) => {
      let urlSearchParams = new URLSearchParams(searchParams);
      value ? urlSearchParams.set(key, value) : urlSearchParams.delete(key, value);
      return decodeURIComponent("?" + urlSearchParams.toString());
    },

    appendOrClear: (key:string, value:string) => {
      let urlSearchParams = new URLSearchParams(searchParams);
      const setOfValues = new Set(urlSearchParams.get(key)?.split(","));
      setOfValues.has(value) ? setOfValues.delete(value) : setOfValues.add(value);
      const arrayOfValues = [...Array.from(setOfValues)];
      const stringValue = arrayOfValues.toSorted((a, b) => a > b ? 1 : -1).join(",");
      stringValue === "" ? urlSearchParams.delete(key) : urlSearchParams.set(key, stringValue);
      return decodeURIComponent("?" + urlSearchParams.toString());
    },

    delete: (key:string|string[]) => {
      let urlSearchParams = new URLSearchParams(searchParams);
      if (Array.isArray(key)) {
        key.forEach((key) => urlSearchParams.delete(key));
      } else {
        urlSearchParams.delete(key);
      }
      return decodeURIComponent("?" + urlSearchParams.toString());
    },

    // leaveOnly: (key:string) => {
    //   const currentValue = value ? value : urlSearchParams.get(key);
    //   urlSearchParams = new URLSearchParams();
    //   urlSearchParams.set(key, currentValue ?? "null");
    //   break;
    // }
   };

  // return (action: Action, key:string|string[], value?:string | string[] | null):string => {
  //   value = String(value);
  //   let urlSearchParams = new URLSearchParams(searchParams);
  //   switch (action) {
  //     case "set": {
  //       if (typeof key !== "string") return "";
  //       urlSearchParams.set(key, value);
  //       break;
  //     }
  //     case "append": {
  //       if (typeof key !== "string") return "";
  //       const valueSet = new Set(urlSearchParams.get(key)?.split(","));
  //       valueSet.has(value) ? valueSet.delete(value) : valueSet.add(value);
  //       const valueString = [...Array.from(valueSet)].toSorted((a, b) => a > b ? 1 : -1).join(",");
  //       console.log( valueString )
  //       valueString === "" ? urlSearchParams.delete(key) : urlSearchParams.set(key, valueString);
  //       break;
  //     }
  //     case "delete": {
  //       if (Array.isArray(key)) {
  //         key.forEach((key) => urlSearchParams.delete(key));
  //       } else {
  //         urlSearchParams.delete(key);
  //       }
  //       break;
  //     }
  //     case "leaveOnly": {
  //       if (typeof key !== "string") return "";
  //       const currentValue = value ? value : urlSearchParams.get(key);
  //       urlSearchParams = new URLSearchParams();
  //       urlSearchParams.set(key, currentValue ?? "null");
  //       break;
  //     }
  //   }
  //   if (!value && typeof key === "string") urlSearchParams.delete(key);
  //   return decodeURIComponent(`?${urlSearchParams}`) || "?";
  // }
}