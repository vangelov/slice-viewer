import { mat4, vec3 } from "gl-matrix";

export enum Axis {
  X = "x",
  Y = "y",
  Z = "z",
}

export type Aabb3 = {
  min: vec3;
  max: vec3;
};

export type point3 = vec3;

export type Volume = {
  dims: vec3;
  bounds: Aabb3;
  matrix: mat4;
  inverseMatrix: mat4;
  data?: Uint16Array;
};

export type Rect = { top: number; left: number; width: number; height: number };

export type Ray3 = {
  origin: point3;
  direction: vec3;
};

export type Plane = {
  point: point3;
  normal: vec3;
};

export type Dimensions = {
  width: number;
  height: number;
  depth: number;
};

export type Cursor = {
  x: number;
  y: number;
  axis: Axis;
  isOnHandle?: boolean;
};
