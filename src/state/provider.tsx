import { ReactNode, useState } from "react";
import { State, StateProvider, SetStateProvider } from "./contexts";

type Props = {
  children: ReactNode;
};

const initialState: State = {};

export function Provider({ children }: Props) {
  const [state, setState] = useState<State>(initialState);

  return (
    <StateProvider value={state}>
      <SetStateProvider value={setState}>{children}</SetStateProvider>
    </StateProvider>
  );
}
