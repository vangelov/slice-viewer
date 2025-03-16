import { mat4, vec3 } from "gl-matrix";
import { Volume } from "types";

const volume: Volume = {
  bounds: {
    max: vec3.fromValues(
      29.940310168260005,
      42.840310168260004,
      35.69894410792381
    ),
    min: vec3.fromValues(
      -30.05791471722,
      -17.157914717220002,
      -22.0993458650886
    ),
  },
  dims: vec3.fromValues(512, 512, 289),
  matrix: mat4.fromValues(
    0.1171875,
    0,
    0,
    0,

    0,
    0.1171875,
    0,
    0,

    0,
    0,
    0.2,
    0,

    -30.05859375,
    -17.15859375,
    -22.1,
    1
  ),
  inverseMatrix: mat4.fromValues(
    8.533333333333333,
    0,
    0,
    0,

    0,
    8.533333333333333,
    0,
    0,

    0,
    0,
    5,
    0,

    256.5,
    146.42000000000002,
    110.5,
    1
  ),
};

export const Config = {
  volume,
};
