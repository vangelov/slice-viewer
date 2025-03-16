import PicoGL, { App, DrawCall } from "picogl";
import { Axis, Volume } from "types";
import { Data } from "data";
import { Camera } from "./camera";
import { VolumeSlicer } from "./volume-slicer";
import { vertexShader, fragmentShader } from "./shaders";

export class Renderer {
  private camera: Camera | null = null;
  private drawCall: DrawCall;
  private volumeSlicer: VolumeSlicer;
  private context: App;
  private deviceWidth: number = 0;
  private deviceHeight: number = 0;

  constructor(volume: Volume, axis: Axis, canvas: HTMLCanvasElement) {
    this.context = PicoGL.createApp(canvas, {
      alpha: false,
      antialias: true,
    });
    this.context.clearColor(0.18, 0.18, 0.18, 1.0);

    const positions = this.context.createVertexBuffer(
      PicoGL.FLOAT,
      3,
      new Float32Array([
        0, 0, 0, +1, 0, 0, +1, +1, 0, +1, +1, 0, 0, +1, 0, 0, 0, 0,
      ])
    );
    const triangleArray = this.context
      .createVertexArray()
      .vertexAttributeBuffer(0, positions);
    const program = this.context.createProgram(vertexShader, fragmentShader);
    this.drawCall = this.context.createDrawCall(program, triangleArray);

    this.volumeSlicer = new VolumeSlicer(this.context, volume, axis);
  }

  reset(camera: Camera, deviceWidth: number, deviceHeight: number) {
    if (
      this.deviceWidth !== deviceWidth ||
      this.deviceHeight !== deviceHeight
    ) {
      this.context.resize(deviceWidth, deviceHeight);
    }

    this.context.clear();
    this.camera = camera;
    this.deviceWidth = deviceWidth;
    this.deviceHeight = deviceHeight;
  }

  drawVolumeSlice(volume: Volume, axis: Axis, normalizedSlice: number) {
    if (!this.camera) return;

    const texture = this.volumeSlicer.getSliceTexture(normalizedSlice);

    const modelMatrix = Data.Volumes.createModelMatrix(
      volume,
      axis,
      normalizedSlice
    );

    this.drawCall.texture("tex", texture);
    this.drawCall.uniform("model", modelMatrix);
    this.drawCall.uniform("view", this.camera.viewMatrix);
    this.drawCall.uniform("proj", this.camera.projectionMatrix);
    this.drawCall.draw();
  }

  blit(target: CanvasRenderingContext2D) {
    target.drawImage(this.context.canvas as HTMLCanvasElement, 0, 0);
  }
}
