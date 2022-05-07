import React from "react";
import {scaleLinear, scaleBand, area, max, curveBasis} from "d3";

export function Barchart(props) {
  const {offsetX, offsetY, height, width, data, location, selectedCity, setSelectedCity} = props;

  const xScale = scaleBand().range([0, width]).domain(data.map((d) => `${d.university}`));
  const yScale = scaleLinear().range([height, 0]).domain([0, max(data, (d) => d.score)]).nice();

  const mouseOver = (d) => {
    setSelectedCity(d);
    // console.log(d);
  }
  const mouseOut = () => {
    setSelectedCity(null);
  }

  const getColor = (selectedCity, d) => {
    //console.log("Should be equal",selectedCity,d)
    return selectedCity && d.city === selectedCity.city && d.country === selectedCity.country ? "red" : "steelblue";
  }

  data.sort((a, b) => (b.score - a.score));
  xScale.domain(data.map(d => d.university));

  return (
    <g transform={`translate(${offsetX}, ${offsetY})`}>
      <text style={{textAnchor: 'end', fontSize: '15px'}} transform={`translate(${width - 10}, 0)`}>
        {"University Scores in 2022 - Assessed by QS World University Rankings®"}
      </text>
      {/* draw x axis */}
      <g>
        {<line x1={0} y1={height} x2={width} y2={height} stroke='black'/>}
        {xScale.domain().map(tickValue =>
          <g key={tickValue + 'B'} transform={`translate(${xScale(tickValue)}, 0)`}>
            <line y2={height}/>
          </g>
        )}
      </g>

      {/* draw y axis */}
      <g>
        {<line y2={height} stroke='black'/>}
        {yScale.ticks(5).map(tickValue =>
          <g key={tickValue} transform={`translate(-10, ${yScale(tickValue)})`}>
            <line x2={10} stroke='black'/>
            <text style={{textAnchor: 'end', fontSize: '10px'}}>
              {tickValue}
            </text>
          </g>
        )}
      </g>

      {/* draw the bars */}
      <g>
        {data.map(d => {
          return <rect key={d.university + "BS"} x={xScale(d.university)}
                       y={yScale(d.score)} width={xScale.bandwidth()} height={height - yScale(d.score)}
                       fill={getColor(selectedCity, d)} stroke={"black"} opacity={0.7}
                       onMouseEnter={() => mouseOver(d)} onMouseOut={mouseOut}/>
        })}
      </g>
    </g>
  );
}