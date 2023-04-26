import { max } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { motion } from 'framer-motion';
import { CloneElement, useId } from 'rdk';
import React, { FC, ReactElement, useMemo } from 'react';
import { ChartShallowDataShape } from '../common';
import { BarListSeries, BarListSeriesProps } from './BarListSeries';

export interface BarListProps {
  /**
   * ID for the chart.
   */
  id?: string;

  /**
   * CSS Classname for the element.
   */
  className?: string;

  /**
   * Style for the element.
   */
  style?: React.CSSProperties;

  /**
   * Data for the chart.
   */
  data: ChartShallowDataShape[];

  /**
   * Sort direction of the data.
   */
  sortDirection?: 'asc' | 'desc' | 'none';

  /**
   * Series to render.
   */
  series?: ReactElement<BarListSeriesProps, typeof BarList>;
}

export const BarList: FC<BarListProps> = ({
  data,
  id,
  className,
  sortDirection,
  style,
  series
}) => {
  const curId = useId(id);

  const mashedData = useMemo(() => {
    const maxVal = max(data, (d) => d.data);
    const domainVal = maxVal == 0 ? [0] : [0, maxVal];
    const groupScale = scaleLinear().domain(domainVal).rangeRound([0, 100]);

    const mashed = data.map((d) => ({
      ...d,
      data: groupScale(d.data as number),
      metadata: {
        value: d.data,
        percent: (data.length * (d.data as number)) / 100
      }
    }));

    if (sortDirection === 'asc') {
      mashed.sort((a, b) => a.data - b.data);
    } else if (sortDirection === 'desc') {
      mashed.sort((a, b) => b.data - a.data);
    }

    return mashed;
  }, [data, sortDirection]);

  return (
    <motion.section
      role="list"
      variants={{
        initial: {
          transition: {
            staggerChildren: 0.05,
            staggerDirection: -1 as any
          }
        },
        animate: {
          transition: {
            staggerChildren: 0.07,
            delayChildren: 0.2
          }
        }
      }}
      id={curId}
      className={className}
      style={style}
    >
      <CloneElement<BarListSeriesProps> element={series} data={mashedData} />
    </motion.section>
  );
};

BarList.defaultProps = {
  data: [],
  sortDirection: 'desc',
  series: <BarListSeries />
};
