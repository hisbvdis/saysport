// const isMobile = dynamic(() => import("@/app/_hooks/useIsMobile"), {ssr: false});

export default function useIsMobile() {
  return window.matchMedia("(width <= 1024px) and (pointer: coarse)").matches;
}