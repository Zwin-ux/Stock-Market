import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './MiniChart.css';

type MiniChartProps = {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
};

const MiniChart: React.FC<MiniChartProps> = ({
  data = [],
  width = 120,
  height = 40,
  color = '#4e79a7'
}) => {
  const chartRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    const svg = d3.select(chartRef.current);
    svg.selectAll('*').remove();

    const x = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([d3.min(data) || 0, d3.max(data) || 1])
      .range([height, 0]);

    const line = d3.line<number>()
      .x((_, i) => x(i))
      .y(d => y(d))
      .curve(d3.curveBasis);

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 1.5)
      .attr('d', line);

  }, [data, width, height, color]);

  return (
    <svg 
      ref={chartRef} 
      width={width} 
      height={height}
      className="mini-chart"
    />
  );
};

export default MiniChart;
