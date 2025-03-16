import { Lib } from "lib";
import { Dispatch, SetStateAction } from "react";
import { Axis, Cursor, point3 } from "types";

export type State = {
  lookTarget?: Record<Axis, point3>;
  zoom?: Record<Axis, number>;
  orthoCenter?: point3;
  maximizedAxis?: Axis;
  cursor?: Cursor | null;
};

const [StateProvider, useStateContext] = Lib.createProviderAndHook<State>();

const [SetStateProvider, useSetStateContext] =
  Lib.createProviderAndHook<Dispatch<SetStateAction<State>>>();

export { StateProvider, SetStateProvider, useStateContext, useSetStateContext };
