import { ViewportsGrid } from "./viewports-grid";
import { Lib } from "lib";
import { Server } from "server";
import { useWindowRect } from "ui/use-window-rect";
import "./ui-root.css";

function formatProgress(progress: number) {
  return `${Math.round(progress * 100)}%`;
}

export function UIRoot() {
  const { volume, isLoading, error, progress } = Server.useVolume();
  const windowRect = useWindowRect();

  Lib.usePreventWheelDefault();

  if (volume) return <ViewportsGrid volume={volume} rect={windowRect} />;

  if (isLoading)
    return (
      <div className="UIRoot-Message">
        <span>Loading</span>
        <span>{formatProgress(progress)}</span>
      </div>
    );

  if (error) return <div className="UIRoot-Message">{error.message}</div>;

  return null;
}
