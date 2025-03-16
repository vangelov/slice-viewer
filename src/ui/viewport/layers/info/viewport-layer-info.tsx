import { Axis, Cursor, point3, Rect, Volume } from "types";
import { Camera } from "ui/gl/camera";
import { memo, useMemo } from "react";
import { Data } from "data";
import "./viewport-layer-info.css";

type Props = {
  camera: Camera;
  rect: Rect;
  orthoCenter: point3;
  volume: Volume;
  axis: Axis;
  cursor?: Cursor | null;
};

function formatValue(value: number | null, length: number, fixed = 0) {
  const stringValue = value === null ? "-" : value.toFixed(fixed);

  const padding =
    stringValue.length < length
      ? Array(length - stringValue.length)
          .fill(" ")
          .join("")
      : "";

  return padding + stringValue;
}

export const ViewportLayerInfo = memo(
  ({ rect, camera, orthoCenter, volume, axis, cursor }: Props) => {
    const cursorWorldPoint = useMemo(
      () =>
        cursor?.axis == axis && !cursor.isOnHandle
          ? camera.getWorldPoint(
              cursor.x,
              cursor.y,
              rect.width,
              rect.height,
              orthoCenter
            )
          : null,
      [orthoCenter, camera, rect, cursor, axis]
    );

    const cursorIndexPoint = useMemo(
      () =>
        cursorWorldPoint
          ? Data.Volumes.getIndexPoint(volume, cursorWorldPoint)
          : null,
      [cursorWorldPoint, volume]
    );

    const valueAtIndexPoint = useMemo(
      () =>
        cursorIndexPoint
          ? Data.Volumes.getDataValueAtIndexPoint(volume, cursorIndexPoint)
          : null,
      [cursorIndexPoint, volume]
    );

    const orthoCenterIndexPoint = useMemo(
      () => Data.Volumes.getIndexPoint(volume, orthoCenter),
      [volume, orthoCenter]
    );

    function getInfoText() {
      const lines = Data.Axes.all.map((currentAxis) => {
        const indexPoint =
          axis === currentAxis ? orthoCenterIndexPoint : cursorIndexPoint;
        const worldPoint =
          axis === currentAxis ? orthoCenter : cursorWorldPoint;

        return `${currentAxis} ${formatValue(
          indexPoint ? Data.Axes.getValue(currentAxis, indexPoint) : null,
          3
        )} / ${Data.Axes.getValue(currentAxis, volume.dims)}   ${formatValue(
          worldPoint ? Data.Axes.getValue(currentAxis, worldPoint) : null,
          7,
          2
        )} cm`;
      });

      return [
        `Value   ${formatValue(valueAtIndexPoint, 7, 2)}   `,
        ...lines,
      ].join("\n");
    }

    return <div className="ViewportLayerInfo">{getInfoText()}</div>;
  },
  (prevProps, nextProps) => {
    let shouldNotRerender = false;

    if (
      prevProps.cursor &&
      nextProps.cursor &&
      nextProps.cursor.axis !== nextProps.axis &&
      Data.Axes.getValue(nextProps.axis, nextProps.orthoCenter) ===
        Data.Axes.getValue(nextProps.axis, prevProps.orthoCenter)
    ) {
      shouldNotRerender = true;
    }

    return shouldNotRerender;
  }
);

ViewportLayerInfo.displayName = "ViewportLayerInfo";
