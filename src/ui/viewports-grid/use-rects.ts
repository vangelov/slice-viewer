import { Data } from "data";
import { useMemo } from "react";
import { Rect } from "types";

export function useRects(rect: Rect) {
  const padding = 25;

  return useMemo(() => {
    const headerRect = Data.Rects.create(
      0,
      padding,
      rect.width - 2 * padding,
      60
    );

    const paddedRectTop = headerRect.top + headerRect.height;

    const paddedRect = Data.Rects.create(
      headerRect.top + headerRect.height,
      0,
      rect.width - 2 * padding,
      rect.height - paddedRectTop
    );

    const mainRect = Data.Rects.create(
      headerRect.top + headerRect.height,
      padding,
      paddedRect.width * 0.65,
      rect.height - headerRect.height - padding
    );

    const sideRectLeft = mainRect.left + mainRect.width + padding;
    const sideRectWidth = paddedRect.width - mainRect.width - padding;
    const sideRectHeihgt = 0.5 * (mainRect.height - padding);

    const topSideRect: Rect = {
      top: mainRect.top,
      left: sideRectLeft,
      width: sideRectWidth,
      height: sideRectHeihgt,
    };

    const bottomSideRect: Rect = {
      top: topSideRect.top + topSideRect.height + padding,
      left: sideRectLeft,
      width: sideRectWidth,
      height: sideRectHeihgt,
    };

    return { headerRect, mainRect, topSideRect, bottomSideRect };
  }, [rect]);
}
