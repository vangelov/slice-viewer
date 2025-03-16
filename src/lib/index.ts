import { mat4, vec3 } from "gl-matrix";
import { useEffect, useContext, createContext } from "react";
import { point3 } from "types";

function clamp(value: number, min: number, max: number) {
  return value > min ? (value < max ? value : max) : min;
}

function assertUnreachable(x: never): never {
  throw new Error("Didn't expect to get here: " + x);
}

function removeMat4Translation(matrix: mat4) {
  const result = mat4.clone(matrix);
  result[12] = 0;
  result[13] = 0;
  result[14] = 0;

  return result;
}

function lerpPoints(a: point3, b: point3, k1: number): point3 {
  const k0 = 1 - k1;

  return vec3.fromValues(
    k0 * a[0] + k1 * b[0],
    k0 * a[1] + k1 * b[1],
    k0 * a[2] + k1 * b[2]
  );
}

const isMacOS = navigator.userAgent.indexOf("Mac OS X") >= 0;

function usePreventWheelDefault() {
  useEffect(() => {
    function onWheel(event: MouseEvent) {
      event.preventDefault();
    }

    document.addEventListener("wheel", onWheel, {
      passive: false,
      capture: true,
    });

    return () => document.removeEventListener("wheel", onWheel);
  }, []);
}

export function createProviderAndHook<T>(initialValue?: T) {
  const context = createContext<T | undefined>(initialValue);

  function useCustomContext() {
    const value = useContext(context);
    if (!value) throw new Error("No context value");
    return value;
  }

  return [context.Provider, useCustomContext] as const;
}

export const Lib = {
  clamp,
  assertUnreachable,
  removeMat4Translation,
  lerpPoints,
  isMacOS,
  usePreventWheelDefault,
  createProviderAndHook,
};
