import { Rect } from "types";
import "./viewport-grid-header.css";

type Props = {
  rect: Rect;
};

export function ViewportGridHeader({ rect }: Props) {
  return (
    <div className="ViewportGridHeader" style={rect}>
      <span>
        <b>ⓘ</b> <b>Scroll</b> to move between slices. Hold <b>Ctrl</b>{" "}
        (Windows, Linux) or <b>Cmd</b> (MacOS) key to zoom and pan.
      </span>

      <a
        target="_blank"
        style={{ color: "white" }}
        href="https://github.com/vangelov/slice-viewer"
      >
        View Github
      </a>
    </div>
  );
}
