import { Data } from "data";
import { vec3 } from "gl-matrix";
import { Lib } from "lib";
import { SetStateAction, useCallback, useMemo } from "react";
import { Aabb3, Axis, point3 } from "types";
import { useStateContext, useSetStateContext, State } from "./contexts";

function validatePoint(value: point3 | undefined, bounds: Aabb3) {
  if (value) return Data.Aabb3s.clampPoint(bounds, value);
  return Lib.lerpPoints(bounds.min, bounds.max, 0.500013158217);
}

// lookTarget

export function useLookTarget(axis: Axis, bounds: Aabb3) {
  const state = useStateContext();
  const value = state.lookTarget?.[axis];
  return useMemo(() => validatePoint(value, bounds), [value, bounds]);
}

export function useSetLookTarget() {
  const setState = useSetStateContext();

  return useCallback(
    (axis: Axis, value: point3) => {
      setState((state) => ({
        ...state,
        lookTarget: { ...state.lookTarget, [axis]: value } as Record<
          Axis,
          vec3
        >,
      }));
    },
    [setState]
  );
}

// orthoCenter

export function useOrthoCenter(bounds: Aabb3) {
  const state = useStateContext();
  const value = state.orthoCenter;
  return useMemo(() => validatePoint(value, bounds), [value, bounds]);
}

export function useSetOrthoCenter() {
  const setState = useSetStateContext();

  return useCallback(
    (value: point3) => {
      setState((state) => ({
        ...state,
        orthoCenter: value,
      }));
    },
    [setState]
  );
}

// zoom

export function useZoom(axis: Axis) {
  const state = useStateContext();
  const value = state.zoom?.[axis];
  return useMemo(() => Lib.clamp(value || 0, 0, 1), [value]);
}

export function useSetZoom() {
  const setState = useSetStateContext();

  return useCallback(
    (axis: Axis, value: number) => {
      setState((state) => ({
        ...state,
        zoom: { ...state.zoom, [axis]: value } as Record<Axis, number>,
      }));
    },
    [setState]
  );
}

// maximizedAxis

export function useMaximizedAxis() {
  const state = useStateContext();
  const value = state.maximizedAxis;
  return useMemo(() => value || Axis.Y, [value]);
}

export function useSetMaximizedAxis() {
  const setState = useSetStateContext();

  return useCallback(
    (value: Axis) => {
      setState((state) => ({
        ...state,
        maximizedAxis: value,
      }));
    },
    [setState]
  );
}

// cursor

export function useCursor() {
  const state = useStateContext();
  const value = state.cursor;
  return value;
}

export function useSetCursor() {
  const setState = useSetStateContext();

  return useCallback(
    (value: SetStateAction<State["cursor"]>) => {
      setState((state) => ({
        ...state,
        cursor: typeof value === "function" ? value(state.cursor) : value,
      }));
    },
    [setState]
  );
}
