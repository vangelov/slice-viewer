import {
  useCursor,
  useLookTarget,
  useMaximizedAxis,
  useOrthoCenter,
  useSetCursor,
  useSetLookTarget,
  useSetMaximizedAxis,
  useSetOrthoCenter,
  useSetZoom,
  useZoom,
} from "./hooks";
import { Provider } from "./provider";

export const State = {
  Provider,

  useLookTarget,
  useSetLookTarget,

  useOrthoCenter,
  useSetOrthoCenter,

  useZoom,
  useSetZoom,

  useMaximizedAxis,
  useSetMaximizedAxis,

  useCursor,
  useSetCursor,
};
