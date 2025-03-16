import { HTMLAttributes, useMemo } from "react";
import { Axis, Rect } from "types";

type Props = {
  axis: Axis;
  maximizedAxis: Axis;
  rect: Rect;
} & HTMLAttributes<HTMLDivElement>;

const labelForAxis = new Map([
  [Axis.X, "Sagittal"],
  [Axis.Y, "Coronal"],
  [Axis.Z, "Axial"],
]);

export function ViewportHeader({ rect, maximizedAxis, axis, ...rest }: Props) {
  const classes = useMemo(() => {
    const result = ["ViewportHeader"];
    if (maximizedAxis !== axis) result.push("ViewportHeader-SizeSmall");

    return result.join(" ");
  }, [maximizedAxis, axis]);

  return (
    <div className={classes} style={rect} {...rest}>
      {labelForAxis.get(axis)}
    </div>
  );
}
