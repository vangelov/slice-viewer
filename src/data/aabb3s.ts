import { vec3 } from "gl-matrix";
import { Lib } from "lib";
import { Aabb3, Axis, point3 } from "types";

function getSize({ max, min }: Aabb3, axis: Axis) {
  switch (axis) {
    case Axis.X:
      return Math.abs(max[0] - min[0]);
    case Axis.Y:
      return Math.abs(max[1] - min[1]);
    case Axis.Z:
      return Math.abs(max[2] - min[2]);
    default:
      return Lib.assertUnreachable(axis);
  }
}

export function scale(
  { min, max }: Aabb3,
  scaleX: number,
  scaleY: number = scaleX,
  scaleZ: number = scaleX
): Aabb3 {
  const originX = 0.5 * (min[0] + max[0]);
  const originY = 0.5 * (min[1] + max[1]);
  const originZ = 0.5 * (min[2] + max[2]);

  const halfX = 0.5 * (max[0] - min[0]);
  const halfY = 0.5 * (max[1] - min[1]);
  const halfZ = 0.5 * (max[2] - min[2]);

  return {
    min: vec3.fromValues(
      originX - halfX * scaleX,
      originY - halfY * scaleY,
      originZ - halfZ * scaleZ
    ),
    max: vec3.fromValues(
      originX + halfX * scaleX,
      originY + halfY * scaleY,
      originZ + halfZ * scaleZ
    ),
  };
}

export function clampPoint({ min, max }: Aabb3, point: point3): point3 {
  return vec3.fromValues(
    Math.min(Math.max(min[0], point[0]), max[0]),
    Math.min(Math.max(min[1], point[1]), max[1]),
    Math.min(Math.max(min[2], point[2]), max[2])
  ) as point3;
}

export const Aabb3s = {
  getSize,
  scale,
  clampPoint,
};
