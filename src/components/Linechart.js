import React from "react";
import {scaleLinear, scaleBand, max, min, curveBasis, csv} from "d3";
import * as d3Line from 'd3'

function useLocation(csvPath) {
  const [dataAll, setData] = React.useState([]);
  React.useEffect(() => {
    csv(csvPath).then(data => {
      data.forEach(d => {
        d.lat = +d.lat;
        d.lng = +d.lng;
        d.ranking = +d.ranking;
        d.year = +d.year;
        d.score = +d.score;
        d.student_faculty_ratio = +d.student_faculty_ratio;
        d.international_students = +d.international_students;
        d.faculty_count = +d.faculty_count;
      });
      setData(data);
    });
  }, []);
  return dataAll;
}

export function Linechart({
                            selectedUniversities = ['NYU', 'NYU Shanghai'],
                            offsetX = 50,
                            offsetY = 20,
                            width = 300,
                            height = 300
                          }) {

  // =============input box============
  // const selectedUniversity = "New York University (NYU)"
  const selectedUniversity = ["New York University (NYU)", "Yale University","Columbia University"]
  const csvUrl = "./qs ranking 200 with location.csv";
  const rawData = useLocation(csvUrl);
  // const data = rawData.filter(d => {
  //   return d.university === selectedUniversity;
  // });
  const array = []
  for (let i=0; i<selectedUniversity.length; i++){
    let data =  rawData.filter(d => {
      return d.university === selectedUniversity[i];})
    data.sort((a, b) => (a.year - b.year))
    array.push(data)
  };
  console.log(array);

  const dataAllUniversity = rawData.filter(d => {
    return selectedUniversity.includes(d.university);})
  console.log(dataAllUniversity);

  // const data = rawData.filter(d => {
  //   return d.university === "New York University (NYU)";
  // });
  // data.sort((a, b) => (a.year - b.year))

  const xScale = scaleBand().range([0, width])
    .domain(array[0].map(d => d.year));
  const yScale = scaleLinear().range([height, 0])
    .domain([max(dataAllUniversity, d => d.ranking), min(dataAllUniversity, d => d.ranking)]).nice();
  const line = d3Line.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.ranking))
    .curve(curveBasis);

  const xTicks = xScale.domain();
  const yTicks = yScale.ticks(5);

  return (
    <svg width={'100%'} height={'100%'} style={{backgroundColor: 'lightyellow'}}>
      <g transform={`translate(${offsetX},${offsetY})`}>
        <line y2={height} stroke={`black`}/>
        {yTicks.map(tickValue => {
          return <g key={tickValue} transform={`translate(-10, ${yScale(tickValue)})`}>
            <line x1={10} x2={width} stroke={"gray"}/>
            <text style={{textAnchor: 'end', fontSize: '18px'}}>
              {tickValue}
            </text>
          </g>
        })}
        <text style={{textAnchor: 'start', fontSize: '18px'}} transform={`translate(10, 0)rotate(0)`}>
          {"University rankings over time"}
        </text>
        <line x1={0} y1={height} x2={width} y2={height} stroke={`black`}/>
        {xTicks.map(tickValue => {
          return <g key={tickValue} transform={`translate(${xScale(tickValue)}, ${height})`}>
            <line y2={5} stroke={"black"}/>
            <text style={{textAnchor: 'middle', fontSize: '18px'}} y={20}>
              {tickValue}
            </text>
          </g>
        })}
        {array.map(data => {
          return <g key={data}>
          <path d={line(data)} stroke={"steelblue"} strokeWidth={3} fill={"none"}/>
          <text style={{ textAnchor:'end', fontSize:'18px'}} transform={`translate(${xScale(data.slice(-1)[0].year)}, ${yScale(data.slice(-1)[0].ranking)})`}>
              {data.slice(-1)[0].university}
          </text>
          </g>

        })}
      </g>
    </svg>
  );
}