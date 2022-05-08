import React from "react";
import {scaleLinear, scaleBand, max, min, curveBasis, curveNatural, csv} from "d3";
import * as d3Line from 'd3'
import {COLORS, useLocation} from "../CommonFunctions";

export function Linechart({
                            hoveredIndex,
                            setHoveredIndex,
                            selectedUniversities = [],
                            offsetX = 50,
                            offsetY = 0,
                            width = 430,
                            height = 250
                          }) {
  const rawData = useLocation();

  if (selectedUniversities.length < 1) {
    return null
  }

  const array = []
  for (let i = 0; i < selectedUniversities.length; i++) {
    let data = rawData.filter(d => {
      return d.university === selectedUniversities[i];
    })
    data.sort((a, b) => (a.year - b.year))
    array.push(data)
  }

  const dataAllUniversity = rawData.filter(d => {
    return selectedUniversities.includes(d.university);
  })

  const xScale = scaleBand().range([0, width])
    .domain([2017, 2018, 2019, 2020, 2021, 2022]);
  const yScale = scaleLinear().range([height, 20])
    .domain([max(dataAllUniversity, d => d.ranking), min(dataAllUniversity, d => d.ranking)]).nice();
  const line = d3Line.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.ranking));

  const xTicks = xScale.domain();
  const yTicks = yScale.ticks(5);

  const handleMouseEnter = (e) => {
    setHoveredIndex(e.target.getAttribute('name').toString());
  };

  const handleMouseLeave = (e) => {
    setHoveredIndex('-1');
  };

  return (
    <svg width={'100%'} height={'100%'} style={{}}>
      <rect x={0} y={0} width={'100%'} height={'100%'} fill={'#E0E0E0'} opacity={'0.5'}/>
      <g transform={`translate(${offsetX},${offsetY})`}>
        <line y2={height} stroke={`black`}/>
        {yTicks.map(tickValue => {
          return (
            <g key={tickValue} transform={`translate(-10, ${yScale(tickValue)})`}>
              <line x1={10} x2={width} stroke={"gray"}/>
              <text style={{textAnchor: 'end', fontSize: '0.8rem'}}>
                {tickValue}
              </text>
            </g>
          );
        })}
        <line x1={0} y1={height} x2={width} y2={height} stroke={`black`}/>
        {xTicks.map(tickValue => {
          return <g key={tickValue} transform={`translate(${xScale(tickValue)}, ${height})`}>
            <line y2={5} stroke={"black"}/>
            <text style={{textAnchor: 'middle', fontSize: '0.8rem'}} y={20}>
              {tickValue}
            </text>
          </g>
        })}
        {array.map((data, index) => {
          return (
            <g key={index}>
              <path
                name={index.toString()} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
                strokeWidth={index.toString() === hoveredIndex ? 6 : 3}
                d={line(data)} stroke={COLORS.slice(index)[0]} fill={"none"}
              />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

