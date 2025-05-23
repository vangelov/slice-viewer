import { memo, useLayoutEffect, useMemo, useState } from "react";
import { Renderer } from "ui/gl/renderer";
import { Camera } from "ui/gl/camera";
import { Axis, Volume } from "types";
import "./viewport-layer-anatomy.css";

type Props = {
  volume: Volume;
  axis: Axis;
  width: number;
  height: number;
  deviceWidth: number;
  deviceHeight: number;
  normalizedSlice: number;
  camera: Camera;
};

export const ViewportLayerAnatomy = memo(
  ({
    volume,
    axis,
    width,
    height,
    deviceWidth,
    deviceHeight,
    normalizedSlice,
    camera,
  }: Props) => {
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

    const renderer = useMemo(
      () => (canvas ? new Renderer(volume, axis, canvas) : null),
      [volume, axis, canvas]
    );

    useLayoutEffect(() => {
      if (renderer) {
        renderer.reset(camera, deviceWidth, deviceHeight);
        renderer.drawVolumeSlice(volume, axis, normalizedSlice);
      }
    });

    return (
      <canvas
        className="ViewportLayerAnatomy"
        ref={setCanvas}
        style={{ width, height }}
        width={deviceWidth}
        height={deviceHeight}
      />
    );
  }
);

ViewportLayerAnatomy.displayName = "ViewportLayerAnatomy";
