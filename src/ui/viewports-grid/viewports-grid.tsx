import { Rect, Volume } from "types";
import { useMemo } from "react";
import { Viewport } from "ui/viewport";
import { State } from "state";
import { Data } from "data";
import { useRects } from "ui/viewports-grid/use-rects";
import { ViewportGridHeader } from "ui/viewports-grid/header";
import "./viewports-grid.css";

type Props = {
  volume: Volume;
  rect: Rect;
};

export function ViewportsGrid({ volume, rect }: Props) {
  const gridWidth = window.innerWidth;
  const gridHeight = window.innerHeight;

  const { headerRect, mainRect, topSideRect, bottomSideRect } = useRects(rect);
  const maximizedAxis = State.useMaximizedAxis();

  const axesLayout = useMemo(
    () => [
      maximizedAxis,
      ...Data.Axes.all.filter((axis) => axis !== maximizedAxis),
    ],
    [maximizedAxis]
  );

  const viewportsRects = useMemo(
    () => [mainRect, topSideRect, bottomSideRect],
    [mainRect, topSideRect, bottomSideRect]
  );

  return (
    <div
      className="ViewportsGrid"
      style={{ width: gridWidth, height: gridHeight }}
    >
      <ViewportGridHeader rect={headerRect} />

      {axesLayout.map((axis, axisIndex) => (
        <Viewport
          key={axis}
          volume={volume}
          axis={axis}
          rect={viewportsRects[axisIndex]}
        />
      ))}
    </div>
  );
}
