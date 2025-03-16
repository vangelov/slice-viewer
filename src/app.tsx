import { State } from "state";
import { UIRoot } from "ui/ui-root";
import "./app.css";

function App() {
  return (
    <State.Provider>
      <UIRoot />
    </State.Provider>
  );
}

export default App;
