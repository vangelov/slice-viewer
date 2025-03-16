import { Axis, point3, Rect } from "types";
import { Camera } from "ui/gl/camera";
import { memo, PointerEvent, useRef } from "react";
import { vec3 } from "gl-matrix";
import { Data } from "data";
import "./viewport-layer-handles.css";

type Props = {
  rect: Rect;
  orthoCenter: point3;
  camera: Camera;
  axis: Axis;
  onHandleHover: (event: PointerEvent<HTMLDivElement>) => void;
  onHandleRelease: (event: PointerEvent<HTMLDivElement>) => void;
  onOrthoCenterChange: (orthoCenter: point3) => void;
};

type Side = "bottom" | "right";

const sideAxesMap = new Map<Axis, Record<Side, Axis>>([
  [Axis.X, { bottom: Axis.Y, right: Axis.Z }],
  [Axis.Y, { bottom: Axis.X, right: Axis.Z }],
  [Axis.Z, { bottom: Axis.X, right: Axis.Y }],
]);

export const ViewportLayerHandles = memo(
  ({
    rect,
    orthoCenter,
    camera,
    axis,

    onOrthoCenterChange,
    onHandleHover,
    onHandleRelease,
  }: Props) => {
    const worldPointRef = useRef<point3 | null>(null);
    const orthoCenterRef = useRef<point3 | null>(null);

    function onHandlePointerDown(event: PointerEvent<HTMLDivElement>) {
      event.stopPropagation();

      const viewportX = event.clientX - rect.left;
      const viewportY = event.clientY - rect.top;

      const world = camera.getWorldPoint(
        viewportX,
        viewportY,
        rect.width,
        rect.height,
        orthoCenter
      );
      worldPointRef.current = world;
      orthoCenterRef.current = orthoCenter;

      function onDocumentPointerUp() {
        document.removeEventListener("pointerup", onDocumentPointerUp);

        worldPointRef.current = null;
        orthoCenterRef.current = null;
      }
      document.addEventListener("pointerup", onDocumentPointerUp);

      (event.target as HTMLElement).setPointerCapture(event.pointerId);
    }

    function onHandlePointerMove(
      event: PointerEvent<HTMLDivElement>,
      side: Side
    ) {
      event.stopPropagation();
      onHandleHover(event);

      if (!worldPointRef.current || !orthoCenterRef.current) return;

      const viewportX = event.clientX - rect.left;
      const viewportY = event.clientY - rect.top;

      const world = camera.getWorldPoint(
        viewportX,
        viewportY,
        rect.width,
        rect.height,
        orthoCenter
      );

      const delta = vec3.create();
      vec3.sub(delta, world, worldPointRef.current);

      const sides = sideAxesMap.get(axis);
      if (!sides) throw new Error("Missing side axis data");

      const sideAxis = sides[side];
      const value = Data.Axes.getValue(sideAxis, orthoCenterRef.current);
      const increment = Data.Axes.getValue(sideAxis, delta);

      const newOrthoCenter = Data.Axes.setValue(
        sideAxis,
        orthoCenterRef.current,
        value + increment
      );
      onOrthoCenterChange(newOrthoCenter);
    }

    function onHandlePointerUp(event: PointerEvent<HTMLDivElement>) {
      const element = document.elementFromPoint(event.clientX, event.clientY);

      if (element && element.className !== "ViewportLayerHandles-Handle")
        onHandleRelease(event);
    }

    function renderHandle(side: Side) {
      const padding = 10;

      const style =
        side === "right"
          ? { right: padding, top: projOrthoCenter[1] - padding }
          : { bottom: padding, left: projOrthoCenter[0] - padding };

      return (
        <div
          className="ViewportLayerHandles-Handle"
          style={style}
          onPointerDown={onHandlePointerDown}
          onPointerUp={onHandlePointerUp}
          onWheel={(event) => event.stopPropagation()}
          onPointerMove={(event) => onHandlePointerMove(event, side)}
        />
      );
    }

    const projOrthoCenter = camera.project(
      orthoCenter,
      rect.width,
      rect.height
    );

    return (
      <div
        className="ViewportLayerHandle"
        style={{
          width: rect.width,
          height: rect.height,
        }}
      >
        {renderHandle("right")}
        {renderHandle("bottom")}
      </div>
    );
  }
);

ViewportLayerHandles.displayName = "ViewportLayerHandles";
