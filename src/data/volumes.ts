import { mat4, vec3 } from "gl-matrix";
import { Axis, point3, Volume } from "../types";
import { Lib } from "lib";
import { Axes } from "data/axes";

function getDimensions(volume: Volume, axis: Axis) {
  const { dims } = volume;

  let width = 0;
  let height = 0;
  let depth = 0;

  switch (axis) {
    case Axis.X:
      depth = dims[0];
      width = dims[1];
      height = dims[2];
      break;

    case Axis.Y:
      width = dims[0];
      depth = dims[1];
      height = dims[2];
      break;

    case Axis.Z:
      width = dims[0];
      height = dims[1];
      depth = dims[2];
      break;

    default:
      return Lib.assertUnreachable(axis);
  }

  return { width, height, depth };
}

function createModelMatrix(volume: Volume, axis: Axis, slice: number) {
  let normalizedToDimsMat: mat4;
  const { dims, matrix } = volume;

  slice = Lib.clamp(slice, 0, 1);

  switch (axis) {
    case Axis.X:
      normalizedToDimsMat = mat4.fromValues(
        0,
        dims[1],
        0,
        0,

        0,
        0,
        dims[2],
        0,

        dims[0],
        0,
        0,
        0,

        dims[0] * slice,
        0,
        0,
        1
      );
      break;

    case Axis.Y:
      normalizedToDimsMat = mat4.fromValues(
        dims[0],
        0,
        0,
        0,

        0,
        0,
        dims[2],
        0,

        0,
        dims[1],
        0,
        0,

        0,
        dims[1] * slice,
        0,
        1
      );

      break;

    case Axis.Z:
      normalizedToDimsMat = mat4.fromValues(
        dims[0],
        0,
        0,
        0,

        0,
        dims[1],
        0,
        0,

        0,
        0,
        dims[2],
        0,

        0,
        0,
        dims[2] * slice,
        1
      );
      break;

    default:
      return Lib.assertUnreachable(axis);
  }

  const result = mat4.create();
  mat4.multiply(result, matrix, normalizedToDimsMat);

  return result;
}

function moveBySingleVoxel(
  volume: Volume,
  point: point3,
  directionDelta: number,
  axis: Axis
) {
  const axisNormal = Axes.getNormal(axis);
  const directionVector = vec3.create();
  vec3.scale(directionVector, axisNormal, directionDelta < 0 ? -1 : 1);

  const increment = vec3.create();
  vec3.transformMat4(
    increment,
    directionVector,
    Lib.removeMat4Translation(volume.matrix)
  );

  const result = vec3.create();
  return vec3.add(result, point, increment);
}

function getNormalizedSlice(volume: Volume, axis: Axis, point: point3) {
  const local = vec3.create();
  vec3.transformMat4(local, point, volume.inverseMatrix);

  const result = Axes.getValue(axis, local) / Axes.getValue(axis, volume.dims);
  return Lib.clamp(result, 0, 1);
}

function getIndexPoint(volume: Volume, worldPoint: point3) {
  const { dims, inverseMatrix } = volume;

  const indexPoint = vec3.create();
  vec3.transformMat4(indexPoint, worldPoint, inverseMatrix);

  if (
    indexPoint[0] < 0 ||
    indexPoint[0] > dims[0] ||
    indexPoint[1] < 0 ||
    indexPoint[1] > dims[1] ||
    indexPoint[2] < 0 ||
    indexPoint[2] > dims[2]
  ) {
    return null;
  }

  indexPoint[0] = Lib.clamp(Math.trunc(indexPoint[0]), 0, dims[0] - 1);
  indexPoint[1] = Lib.clamp(Math.trunc(indexPoint[1]), 0, dims[1] - 1);
  indexPoint[2] = Lib.clamp(Math.trunc(indexPoint[2]), 0, dims[2] - 1);

  return indexPoint;
}

function getDataValueAtIndexPoint(volume: Volume, indexPoint: point3) {
  const { dims, data } = volume;
  if (!data) return null;

  const index =
    indexPoint[0] + indexPoint[1] * dims[0] + indexPoint[2] * dims[0] * dims[1];

  const value = data[index];

  return value;
}

export const Volumes = {
  getDimensions,
  createModelMatrix,
  moveBySingleVoxel,
  getNormalizedSlice,
  getDataValueAtIndexPoint,
  getIndexPoint,
};
