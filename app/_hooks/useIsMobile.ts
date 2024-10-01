"use client";

export default function useIsMobile() {
  return window.matchMedia("(width <= 1024px) and (pointer: coarse)").matches;
}