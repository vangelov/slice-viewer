import { Axis, point3, Rect } from "types";
import { Camera } from "ui/gl/camera";
import { memo } from "react";
import "./viewport-layer-lines.css";

type Props = {
  rect: Rect;
  orthoCenter: point3;
  camera: Camera;
  axis: Axis;
};

export const ViewportLayerLines = memo(
  ({ rect, orthoCenter, camera }: Props) => {
    function renderHorizontalLine() {
      return (
        <line
          className="ViewportLayerLines-Line"
          x1="0"
          y1={projOrthoCenter[1]}
          x2={rect.width}
          y2={projOrthoCenter[1]}
        />
      );
    }

    function renderVerticalLine() {
      return (
        <line
          className="ViewportLayerLines-Line"
          x1={projOrthoCenter[0]}
          y1="0"
          x2={projOrthoCenter[0]}
          y2={rect.height}
        />
      );
    }

    const projOrthoCenter = camera.project(
      orthoCenter,
      rect.width,
      rect.height
    );

    return (
      <svg className="ViewportLayerLines">
        {renderHorizontalLine()}
        {renderVerticalLine()}
      </svg>
    );
  }
);

ViewportLayerLines.displayName = "ViewportLayerLines";
