import { vec3 } from "gl-matrix";
import { Plane, Ray3 } from "types";

function intersectPlane(ray: Ray3, plane: Plane) {
  const p = vec3.create();
  vec3.sub(p, plane.point, ray.origin);

  let k = 1 / vec3.dot(ray.direction, plane.normal);
  k = Number.isFinite(k) ? k : -Infinity;
  return vec3.dot(p, plane.normal) * k;
}

function getPoint({ origin, direction }: Ray3, t: number) {
  return vec3.fromValues(
    origin[0] + t * direction[0],
    origin[1] + t * direction[1],
    origin[2] + t * direction[2]
  );
}

export const Ray3s = {
  intersectPlane,
  getPoint,
};
