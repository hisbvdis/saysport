"use client";
import { useSearchParams } from "next/navigation";


export const useManageSearchParams = () => {
  const searchParams = useSearchParams();

  return {
    set: (key:string, value:string, params?:string) => {
      const urlSearchParams = params ? new URLSearchParams(params) : new URLSearchParams(searchParams);
      value ? urlSearchParams.set(key, value) : urlSearchParams.delete(key, value);
      return decodeURIComponent(`?${urlSearchParams.toString()}`);
    },

    appendOrClear: (key:string, value:string, params?:string) => {
      const urlSearchParams = params ? new URLSearchParams(params) : new URLSearchParams(searchParams);
      const setOfValues = new Set(urlSearchParams.get(key)?.split(","));
      setOfValues.has(value) ? setOfValues.delete(value) : setOfValues.add(value);
      const arrayOfValues = [...Array.from(setOfValues)];
      const stringValue = arrayOfValues.toSorted((a, b) => a > b ? 1 : -1).join(",");
      stringValue === "" ? urlSearchParams.delete(key) : urlSearchParams.set(key, stringValue);
      return decodeURIComponent(`?${urlSearchParams.toString()}`);
    },

    delete: (key:string[], params?:string) => {
      const urlSearchParams = params ? new URLSearchParams(params) : new URLSearchParams(searchParams);
      key.forEach((key) => urlSearchParams.delete(key));
      return decodeURIComponent(`?${urlSearchParams.toString()}`);
    },
   };
}