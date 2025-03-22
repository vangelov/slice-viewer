import { vec3 } from "gl-matrix";
import { Lib } from "lib";
import { Axis, point3 } from "types";

const normalsMap = new Map([
  [Axis.X, vec3.fromValues(1, 0, 0)],
  [Axis.Y, vec3.fromValues(0, 1, 0)],
  [Axis.Z, vec3.fromValues(0, 0, 1)],
]);

const all = [Axis.X, Axis.Y, Axis.Z];

function getNormal(axis: Axis) {
  const normal = normalsMap.get(axis);
  if (!normal) throw new Error("No normal for axis: " + axis);
  return normal;
}

function getValue(axis: Axis, pointOrVector: point3 | vec3) {
  switch (axis) {
    case Axis.X:
      return pointOrVector[0];
    case Axis.Y:
      return pointOrVector[1];
    case Axis.Z:
      return pointOrVector[2];

    default:
      return Lib.assertUnreachable(axis);
  }
}

function setValue(axis: Axis, pointOrVector: point3 | vec3, value: number) {
  switch (axis) {
    case Axis.X:
      return vec3.fromValues(value, pointOrVector[1], pointOrVector[2]);
    case Axis.Y:
      return vec3.fromValues(pointOrVector[0], value, pointOrVector[2]);
    case Axis.Z:
      return vec3.fromValues(pointOrVector[0], pointOrVector[1], value);

    default:
      return Lib.assertUnreachable(axis);
  }
}

export const Axes = {
  getNormal,
  getValue,
  setValue,
  all,
};
