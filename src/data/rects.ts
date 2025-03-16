import { Rect } from "types";

export function create(
  top: number,
  left: number,
  width: number,
  height: number
): Rect {
  return {
    top: Math.round(top),
    left: Math.round(left),
    width: Math.round(width),
    height: Math.round(height),
  };
}

export const Rects = {
  create,
};
