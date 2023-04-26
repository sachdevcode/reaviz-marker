import React, { FC, ReactElement } from 'react';
import { RadialAxisArc, RadialAxisArcProps } from './RadialAxisArc';
import { CloneElement } from 'rdk';
import { scaleLinear } from 'd3-scale';
import { getPointsForLevels } from './utils';
import { RadialAxisArcLine, RadialAxisArcLineProps } from './RadialAxisArcLine';

export interface RadialAxisArcSeriesProps {
  /**
   * Arc element to render.
   */
  arc: ReactElement<RadialAxisArcProps, typeof RadialAxisArc>;

  /**
   * Line element to render.
   */
  line: ReactElement<RadialAxisArcLineProps, typeof RadialAxisArcLine>;

  /**
   * Number of arcs to render.
   */
  count: number;

  /**
   * Inner radius of the arc.
   */
  innerRadius: number;

  /**
   * Outer radius of the arc.
   */
  outerRadius: number;

  /**
   * Calculated tick values by the Radial Axis.
   */
  tickValues?: any[];
}

export const RadialAxisArcSeries: FC<Partial<RadialAxisArcSeriesProps>> = ({
  count,
  innerRadius,
  outerRadius,
  line,
  arc,
  tickValues
}) => {
  const scale = scaleLinear()
    .domain([0, count])
    .range([innerRadius, outerRadius]);

  const arcs = scale.ticks(count);

  const points = getPointsForLevels({
    count,
    outerRadius,
    ticks: tickValues.length,
    arcs
  });

  return (
    <>
      {line && (
        <>
          {points.map((d, i) => (
            <CloneElement<RadialAxisArcLineProps>
              element={line}
              key={i}
              data={d}
              index={i}
            />
          ))}
        </>
      )}
      {arc && (
        <>
          {arcs.map((d) => (
            <CloneElement<RadialAxisArcProps>
              element={arc}
              key={d}
              index={d}
              scale={scale}
            />
          ))}
        </>
      )}
    </>
  );
};

RadialAxisArcSeries.defaultProps = {
  type: 'arc',
  count: 12,
  arc: <RadialAxisArc />
};
