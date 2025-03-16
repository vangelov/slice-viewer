import { Data } from "data";
import { useEffect, useState } from "react";

export function useWindowRect() {
  const [windowRect, setWindowRect] = useState(() =>
    Data.Rects.create(0, 0, window.innerWidth, window.innerHeight)
  );

  useEffect(() => {
    let timeoutId = -1;

    function resize() {
      window.clearTimeout(timeoutId);

      timeoutId = window.setTimeout(() => {
        setWindowRect(
          Data.Rects.create(0, 0, window.innerWidth, window.innerHeight)
        );
      }, 500);
    }

    window.addEventListener("resize", resize);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return windowRect;
}
