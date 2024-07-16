import type { ChangeEvent } from "react";

export const handleQuotes = (e:ChangeEvent<HTMLInputElement>) => {
  const entries = Array.from(e.target.value.matchAll(/["']/g));
  if (entries.length === 1) {
    e.target.value = e.target.value.replace(/["']/, () => Array.from(e.target.value.matchAll(/[«»]/g)).length % 2 === 0 ? "«" : "»");
  } else if (entries.length >= 2) {
    e.target.value = entries.reduce<string>((acc, {input, index}, i) => acc.length ? acc.split("").with(index, i % 2 === 0 ? "«" : "»").join("") : input.split("").with(index, i % 2 === 0 ? "«" : "»").join(""), "");
  }
  return e;
}