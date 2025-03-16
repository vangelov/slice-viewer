import { Axis, point3, Rect, Volume } from "types";
import { useRef, PointerEvent, useMemo, useCallback, WheelEvent } from "react";
import { Camera } from "ui/gl/camera";
import { vec3 } from "gl-matrix";
import { Lib } from "lib";
import { Data } from "data";

import { State } from "state";

type Params = {
  volume: Volume;
  axis: Axis;
  contentRect: Rect;
};

function isModifierKeyOn(event: PointerEvent<HTMLElement> | WheelEvent) {
  return Lib.isMacOS ? event.metaKey : event.ctrlKey;
}

export function useState({ volume, axis, contentRect }: Params) {
  const worldPointRef = useRef<point3>();
  const cameraRef = useRef<Camera>();

  const otherAxes = useMemo(
    () => Data.Axes.all.filter((a) => axis !== a),
    [axis]
  );

  const zoom = State.useZoom(axis);
  const setZoom = State.useSetZoom();

  const lookTarget = State.useLookTarget(axis, volume.bounds);
  const setLookTarget = State.useSetLookTarget();

  const orthoCenter = State.useOrthoCenter(volume.bounds);
  const setOrthoCenter = State.useSetOrthoCenter();

  const { deviceWidth, deviceHeight } = useMemo(
    () => ({
      deviceWidth: contentRect.width * window.devicePixelRatio,
      deviceHeight: contentRect.height * window.devicePixelRatio,
    }),
    [contentRect]
  );

  const sliceDepth = useMemo(
    () => Data.Axes.getValue(axis, orthoCenter),
    [orthoCenter, axis]
  );

  const setMaximizedAxis = State.useSetMaximizedAxis();
  const setCursor = State.useSetCursor();

  const camera = useMemo(
    () =>
      new Camera({
        axisLook: axis,
        sliceDepth,
        lookTarget,
        world: volume.bounds,
        deviceWidth,
        deviceHeight,
        zoom,
      }),
    [
      axis,
      sliceDepth,
      lookTarget,
      volume.bounds,
      deviceWidth,
      deviceHeight,
      zoom,
    ]
  );

  function onWheel(event: WheelEvent<HTMLDivElement>) {
    if (isModifierKeyOn(event)) {
      const viewportX = event.clientX - contentRect.left;
      const viewportY = event.clientY - contentRect.top;

      const worldPoint = camera.getWorldPoint(
        viewportX,
        viewportY,
        contentRect.width,
        contentRect.height,
        orthoCenter
      );

      const newZoom = Lib.clamp(
        event.deltaY / -window.screen.height + zoom,
        0,
        1
      );

      const zoomedCamera = new Camera({
        axisLook: axis,
        sliceDepth,
        lookTarget,
        world: volume.bounds,
        deviceWidth,
        deviceHeight,
        zoom: newZoom,
      });

      const zoomedWorldPoint = zoomedCamera.getWorldPoint(
        viewportX,
        viewportY,
        contentRect.width,
        contentRect.height,
        orthoCenter
      );

      const lookTargetDelta = vec3.create();
      vec3.sub(lookTargetDelta, worldPoint, zoomedWorldPoint);

      const newLookTarget = vec3.create();
      vec3.add(newLookTarget, camera.origin, lookTargetDelta);

      setZoom(axis, newZoom);
      setLookTarget(axis, newLookTarget);
    } else {
      const newOrthoCenter = Data.Volumes.moveBySingleVoxel(
        volume,
        orthoCenter,
        Math.sign(event.deltaY),
        axis
      );
      setOrthoCenter(newOrthoCenter);
    }
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    const viewportX = event.clientX - contentRect.left;
    const viewportY = event.clientY - contentRect.top;

    event.preventDefault();

    cameraRef.current = camera;

    function onPointerUp() {
      document.removeEventListener("pointerup", onPointerUp);
      worldPointRef.current = undefined;
      cameraRef.current = undefined;
    }
    document.addEventListener("pointerup", onPointerUp);

    (event.target as HTMLElement).setPointerCapture(event.pointerId);

    if (!isModifierKeyOn(event)) {
      const p0 = camera.getWorldPoint(
        viewportX,
        viewportY,
        contentRect.width,
        contentRect.height,
        orthoCenter
      );
      setOrthoCenter(p0);
      otherAxes.forEach((otherAxis) => setLookTarget(otherAxis, p0));

      return;
    }

    worldPointRef.current = camera.getWorldPoint(
      viewportX,
      viewportY,
      contentRect.width,
      contentRect.height,
      orthoCenter
    );
  }

  function onPointerLeave() {
    setCursor(null);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const viewportX = event.clientX - contentRect.left;
    const viewportY = event.clientY - contentRect.top;

    setCursor({ x: viewportX, y: viewportY, axis });

    if (!cameraRef.current) return;

    const world = cameraRef.current.getWorldPoint(
      viewportX,
      viewportY,
      contentRect.width,
      contentRect.height,
      orthoCenter
    );

    if (!worldPointRef.current) {
      setOrthoCenter(world);
      otherAxes.forEach((otherAxis) => setLookTarget(otherAxis, world));
      return;
    }

    const delta = vec3.create();
    vec3.sub(delta, worldPointRef.current, world);

    const newLookTarget = vec3.create();
    vec3.add(newLookTarget, cameraRef.current.origin, delta);

    setLookTarget(axis, newLookTarget);
  }

  const onHandleHover = useCallback(() => {
    setCursor((cursor) => (cursor ? { ...cursor, isOnHandle: true } : null));
  }, [setCursor]);

  const onHandleRelease = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const viewportX = event.clientX - contentRect.left;
      const viewportY = event.clientY - contentRect.top;

      setCursor({ x: viewportX, y: viewportY, axis });
    },
    [setCursor, axis, contentRect]
  );

  const onHeaderClick = useCallback(() => {
    setMaximizedAxis(axis);
  }, [setMaximizedAxis, axis]);

  return {};
}
