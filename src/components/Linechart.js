import React from "react";
import {scaleLinear, scaleBand, max, min, curveBasis} from "d3";
import * as d3Line from 'd3'

export function Linechart(props){
  const {offsetX, offsetY, width, height, data} = props;

  data.sort((a, b) => (a.year - b.year))

  const xScale = scaleBand().range([0, width])
    .domain(data.map(d => d.year));
  const yScale = scaleLinear().range([height, 0])
    .domain([max(data, d => d.ranking),min(data, d => d.ranking)]).nice();
  const line = d3Line.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.ranking))
    .curve(curveBasis);

  const xTicks = xScale.domain();
  const yTicks = yScale.ticks(5);

  return <g transform={`translate(${offsetX},${offsetY})`}>
    <line y2={height} stroke={`black`} />
    {yTicks.map( tickValue => {
      return <g key={tickValue} transform={`translate(-10, ${yScale(tickValue)})`}>
        <line x1={10} x2={width} stroke={"gray"} />
        <text style={{ textAnchor:'end', fontSize:'18px' }}>
          {tickValue}
        </text>
      </g>
    })}
    <text style={{ textAnchor:'start', fontSize:'18px'}} transform={`translate(10, 0)rotate(0)`}>
      {"University rankings over time"}
    </text>
    <line x1={0} y1={height} x2={width} y2={height} stroke={`black`} />
    {xTicks.map( tickValue => {
      return <g key={tickValue} transform={`translate(${xScale(tickValue)}, ${height})`}>
        <line y2={5} stroke={"black"} />
        <text style={{ textAnchor:'middle', fontSize:'18px'}} y={20}>
          {tickValue}
        </text>
      </g>
    })}
    <path d={line(data)} stroke={"steelblue"} strokeWidth={3} fill={"none"} />
  </g>
}