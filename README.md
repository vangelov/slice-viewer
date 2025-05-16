<p align="center">
   <a href="https://vangelov.github.io/slice-viewer/" target="_blank">
    <img src="screenshot.png" alt="Devices preview" />
  </a>
</p>


<div align="center">

  [Live version](https://vangelov.github.io/slice-viewer/)

</div>

## Motivation

Curious about how medical scan viewers work, I built one with React and WebGL to explore scans in all three planes.

## Scan Data
I'm using the sample CT scan from [here](https://github.com/SlicerRt/SlicerRtData/tree/master/aria-phantom-contours-branching). It's convereted to a custom format that's easier to deal with than DICOM. In the future it will definitely be useful if a third party library can be used to import any DICOM.

## Dependecies 
Apart from React, the app depends on:
- [PicoGL](https://tsherif.github.io/picogl.js/): A very thin layer on top of WebGL that provides a more convenient API.
- [gl-matrix](https://glmatrix.net/): For vector and matrix transformations.
- [zip.js](https://gildas-lormeau.github.io/zip.js/): For unzippig the volume data. 

## Implementation
Each plane viewport consists of several layers from bottom to top:

- **Anatomy**: Uses a separate WebGL context to render a single slice of the volume depending on the plane (axial, sagittal, coronal).
- **Lines**: Shows where the other 2 planes are.
- **Handles** (when the cursor is over the viewport): Allows to move a single plane from another viewport.
- **Info**: Shows information for the current cursor position.

All viewports and their layers are memoized so they only re-rendered when necessary.

The app's state is a `useState` that's injected with a context. Reading from and writing to the state is done with custom hooks.

### 

## Scripts

In the project directory, you can run:

#### `npm run dev`
Runs the app in the development mode.\
Open [http://127.0.0.1:5173/](http://127.0.0.1:5173/) to view it in the browser.

#### `npm run build`
Builds the app for production in the `dist` folder.


