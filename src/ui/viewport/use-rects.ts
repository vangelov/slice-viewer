import { Data } from "data";
import { useMemo } from "react";
import { Rect } from "types";

type Params = {
  rect: Rect;
};

const headerHeight = 35;

export function useRects({ rect }: Params) {
  const headerRect = useMemo(
    () => Data.Rects.create(rect.top, rect.left, rect.width, headerHeight),
    [rect]
  );

  const contentRect = useMemo(
    () =>
      Data.Rects.create(
        rect.top + headerHeight,
        rect.left,
        rect.width,
        rect.height - headerHeight
      ),
    [rect]
  );

  const { deviceWidth, deviceHeight } = useMemo(
    () => ({
      deviceWidth: contentRect.width * window.devicePixelRatio,
      deviceHeight: contentRect.height * window.devicePixelRatio,
    }),
    [contentRect]
  );

  return { headerRect, contentRect, deviceWidth, deviceHeight };
}
