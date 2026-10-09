import { useEffect } from "react";

export function usePreloadImage(src: string) {
  useEffect(() => {
    const img = new Image();
    img.src = src;
  }, [src]);
}