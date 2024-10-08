// const isMobile = useIsMobile();
// if (isMobile()) {}

export function useIsMobile() {
  return () => window.matchMedia("(width <= 1024px) and (pointer: coarse)").matches;
}