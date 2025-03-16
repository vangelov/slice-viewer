import { memo, useLayoutEffect, useMemo, useState } from "react";
import { Renderer } from "ui/gl/renderer";
import { Camera } from "ui/gl/camera";
import { Axis, Volume } from "types";

type Props = {
  volume: Volume;
  axis: Axis;
  width: number;
  height: number;
  normalizedSlice: number;
  camera: Camera;
};

export const ViewportLayerAnatomy = memo(
  ({ volume, axis, width, height, normalizedSlice, camera }: Props) => {
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
    const deviceWidth = width * window.devicePixelRatio;
    const deviceHeight = height * window.devicePixelRatio;

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
        style={{ width, height, position: "absolute" }}
        width={deviceWidth}
        height={deviceHeight}
      />
    );
  }
);

ViewportLayerAnatomy.displayName = "ViewportLayerAnatomy";
