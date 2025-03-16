import { Data } from "data";
import { Lib } from "lib";
import PicoGL, { App, Texture } from "picogl";
import { Axis, Dimensions, Volume } from "types";

export class VolumeSlicer {
  public context: App;
  public volume: Volume;
  public axis: Axis;

  private volumeDimensions: Dimensions;
  private texture: Texture;

  private static sliceCopyBuffer: ArrayBuffer | null = null;

  constructor(context: App, volume: Volume, axis: Axis) {
    this.context = context;
    this.volume = volume;
    this.axis = axis;
    this.volumeDimensions = Data.Volumes.getDimensions(volume, axis);

    const { width, height } = this.volumeDimensions;
    this.texture = this.context.createTexture2D(width, height, {
      internalFormat: PicoGL.R16UI,
      type: PicoGL.UNSIGNED_SHORT,
    });
  }

  public getSliceTexture(normalizedSlice: number) {
    const { width, height, depth } = this.volumeDimensions;
    const sliceData = this.createSliceCopyBufferView(width * height);
    const slice = Math.trunc(normalizedSlice * depth);

    this.sliceVolume(slice, sliceData);
    this.texture.data(sliceData);

    return this.texture;
  }

  private createSliceCopyBufferView(capacity: number) {
    if (VolumeSlicer.sliceCopyBuffer) {
      try {
        return new Uint16Array(VolumeSlicer.sliceCopyBuffer, 0, capacity);
      } catch (e) {
        console.warn(e);
      }
    }

    const view = new Uint16Array(capacity);
    VolumeSlicer.sliceCopyBuffer = view.buffer;

    return view;
  }

  private sliceVolume(slice: number, dest: Uint16Array) {
    switch (this.axis) {
      case Axis.X:
        this.sliceVolumeX(slice, dest);
        break;
      case Axis.Y:
        this.sliceVolumeY(slice, dest);
        break;
      case Axis.Z:
        this.sliceVolumeZ(slice, dest);
        break;

      default:
        return Lib.assertUnreachable(this.axis);
    }
  }

  private sliceVolumeX(slice: number, destination: Uint16Array) {
    const { data, dims } = this.volume;
    if (!data) return;

    const [_sizeX, sizeY, sizeZ] = dims;
    const sizeX = Math.trunc(_sizeX);

    let i = 0;
    let offset = slice;

    for (let z = 0; z < sizeZ; z++) {
      for (let y = 0; y < sizeY; y++) {
        destination[i++] = data[offset];
        offset += sizeX;
      }
    }
  }

  private sliceVolumeY(slice: number, destination: Uint16Array) {
    const { data, dims } = this.volume;
    if (!data) return;

    const [_sizeX, _sizeY, sizeZ] = dims;
    const sizeX = Math.trunc(_sizeX);
    const sizeXY = Math.trunc(sizeX * _sizeY);

    let i = 0;
    let offset = Math.trunc(slice * sizeX);

    for (let z = 0; z < sizeZ; z++) {
      for (let x = 0; x < sizeX; x++) {
        destination[i++] = data[offset++];
      }
      offset += sizeXY - sizeX;
    }
  }

  private sliceVolumeZ(slice: number, dest: Uint16Array) {
    const { data, dims } = this.volume;
    if (!data) return;

    const [sizeX, sizeY] = dims;
    const offset = Math.trunc(slice * sizeX * sizeY);
    const view = data.slice(offset, offset + dest.length);

    dest.set(view);
  }
}
