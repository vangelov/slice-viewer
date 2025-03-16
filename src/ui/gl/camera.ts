import { mat4, vec2, vec3, vec4 } from "gl-matrix";
import { Lib } from "lib";
import { Aabb3, Axis, Plane, point3, Ray3 } from "types";
import { Data } from "data";

type CameraParams = {
  world: Aabb3;
  axisLook: Axis;
  deviceWidth: number;
  deviceHeight: number;
  zoom: number;
  sliceDepth: number;
  lookTarget: point3;
};

type CameraOrientation = {
  axisWidth: Axis;
  axisHeight: Axis;
  dirLook: vec3;
  up: vec3;
};

function zoomRate(level01: number) {
  return Math.log(1 + (Math.E - 1) * level01);
}

export class Camera {
  public origin: point3;
  public dirLook: vec3;
  public dirUp: vec3;

  private width: number;
  private height: number;

  private near: number;
  private far: number;

  private viewProjectionMatrix: mat4;
  private invertedViewProjectionMatrix: mat4;

  public viewMatrix = mat4.create();
  public projectionMatrix = mat4.create();

  constructor({
    world,
    axisLook,
    deviceWidth,
    deviceHeight,
    zoom,
    sliceDepth,
    lookTarget,
  }: CameraParams) {
    const { axisWidth, axisHeight, dirLook, up } =
      this.getOrientation(axisLook);

    const zoomFactor = 1.0 - zoomRate(zoom) * 0.9;

    const depth = Data.Aabb3s.getSize(world, axisLook);
    let width = Data.Aabb3s.getSize(world, axisWidth);
    let height = Data.Aabb3s.getSize(world, axisHeight);

    const worldAspect = width / height;
    const viewportAspect = deviceWidth / deviceHeight;
    const fit = worldAspect / viewportAspect;
    if (fit > 1) height *= fit;
    else if (fit < 1) width /= fit;

    width *= zoomFactor;
    height *= zoomFactor;
    width = height * (deviceWidth / deviceHeight);

    const unclampedOrigin = Data.Axes.setValue(
      axisLook,
      lookTarget,
      sliceDepth
    );
    const origin = Data.Aabb3s.clampPoint(
      Data.Aabb3s.scale(
        world,
        1.0 - zoomFactor,
        1.0 - zoomFactor,
        1.0 - zoomFactor
      ),
      unclampedOrigin
    );

    this.origin = origin;
    this.dirLook = dirLook;
    this.dirUp = up;

    this.width = width;
    this.height = height;

    this.near = -depth;
    this.far = depth;

    this.viewMatrix = this.createViewMatrix();
    this.projectionMatrix = this.createProjectionMatrix();

    this.viewProjectionMatrix = mat4.create();
    mat4.multiply(
      this.viewProjectionMatrix,
      this.projectionMatrix,
      this.viewMatrix
    );
    this.invertedViewProjectionMatrix = mat4.create();
    mat4.invert(this.invertedViewProjectionMatrix, this.viewProjectionMatrix);
  }

  getOrientation(axisLook: Axis): CameraOrientation {
    switch (axisLook) {
      case Axis.X:
        return {
          axisWidth: Axis.Y,
          axisHeight: Axis.Z,
          dirLook: vec3.fromValues(+1, 0, 0),
          up: vec3.fromValues(0, 0, +1),
        };
      case Axis.Y:
        return {
          axisWidth: Axis.X,
          axisHeight: Axis.Z,
          dirLook: vec3.fromValues(0, +1, 0),
          up: vec3.fromValues(0, 0, +1),
        };
      case Axis.Z:
        return {
          axisWidth: Axis.X,
          axisHeight: Axis.Y,
          dirLook: vec3.fromValues(0, 0, +1),
          up: vec3.fromValues(0, -1, 0),
        };

      default:
        return Lib.assertUnreachable(axisLook);
    }
  }

  createViewMatrix() {
    const { origin, dirLook, dirUp } = this;

    const center = vec3.create();
    vec3.add(center, origin, dirLook);

    const result = mat4.create();
    mat4.lookAt(result, origin, center, dirUp);

    return result;
  }

  createProjectionMatrix() {
    const { width, height, near, far } = this;

    const left = -width / 2;
    const right = +width / 2;
    const top = +height / 2;
    const bottom = -height / 2;

    const result = mat4.create();
    mat4.ortho(result, left, right, bottom, top, near, far);
    return result;
  }

  unproject(
    viewportX: number,
    viewportY: number,
    viewportWidth: number,
    viewportHeight: number
  ): Ray3 {
    const x = (viewportX / viewportWidth) * 2 - 1;
    const y = (1 - viewportY / viewportHeight) * 2 - 1;
    const ndcPoint0 = vec3.fromValues(x, y, -1);
    const ndcPoint1 = vec3.fromValues(x, y, +1);

    const point0 = vec3.create();
    vec3.transformMat4(point0, ndcPoint0, this.invertedViewProjectionMatrix);
    const point1 = vec3.create();
    vec3.transformMat4(point1, ndcPoint1, this.invertedViewProjectionMatrix);

    const rayDirection = vec3.create();
    vec3.sub(rayDirection, point1, point0);
    return { origin: point0, direction: rayDirection };
  }

  getWorldPoint(
    viewportX: number,
    viewportY: number,
    viewportWidth: number,
    viewportHeight: number,
    point: point3
  ) {
    const ray = this.unproject(
      viewportX,
      viewportY,
      viewportWidth,
      viewportHeight
    );

    const plane: Plane = { point, normal: this.dirLook };
    return Data.Ray3s.getPoint(ray, Data.Ray3s.intersectPlane(ray, plane));
  }

  project(worldPoint: point3, viewportWidth: number, viewportHeight: number) {
    const homWorldPoint = vec4.fromValues(
      worldPoint[0],
      worldPoint[1],
      worldPoint[2],
      1
    );
    const ndcPoint = vec4.create();
    vec4.transformMat4(ndcPoint, homWorldPoint, this.viewProjectionMatrix);
    vec4.scale(ndcPoint, ndcPoint, 1 / ndcPoint[3]);

    return vec2.fromValues(
      ((ndcPoint[0] + 1) / 2) * viewportWidth,
      ((1 - ndcPoint[1]) / 2) * viewportHeight
    );
  }
}
