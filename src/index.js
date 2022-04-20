import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

import { WorldMap } from "./worldmap";
import { json, csv, scaleOrdinal, schemeOranges } from "d3";
import * as topojson from "topojson-client";

const mapUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const csvUrl = "./qs ranking 200 with location.csv";

function useMap(jsonPath) {
  const [data, setData] = React.useState(null);
  React.useEffect(() => {
    json(jsonPath).then(topoJsonData => {
      setData(topojson.feature(topoJsonData, topoJsonData.objects.countries))});
  }, []);
  return data;
}

function useLocation(csvPath) {
  const [dataAll, setData] = React.useState(null);
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

function Geomap() {

  const WIDTH = 1000;
  const HEIGHT = 600;
  const margin = {left: 50, right: 50, top: 50, bottom: 50};

  const [selectedCity, setSelectedCity] = React.useState(null);
  const rawData = useLocation(csvUrl);
  const map = useMap(mapUrl);
  //==============data processing=====================
  if (!map || !rawData) {
    return <pre>Loading...</pre>;
  };
  //console.log(rawData, map);

  const yearData = rawData.filter( d => {
    return d.year == 2022;
  });
  //console.log(yearData, map);

  const cityData = [];
  for (let i = 0; i < yearData.length; i++){
    const city = yearData[i]['city']
    const country = yearData[i]['country']
    cityData.push(city+country)
  };
  //console.log(cityData, map);

  const count = {};
  for (const element of cityData) {
    if (count[element]) {
      count[element] += 1;
    } else {
      count[element] = 1;
    }
  }
  //console.log(count);

  const groupByCity = [];
  for (let i = 0; i < yearData.length; i++){
    const currentCity = yearData[i]['city']
    const currentCountry = yearData[i]['country']
      groupByCity.push({
        city: yearData[i]['city'],
        lat: yearData[i]['lat'],
        lng: yearData[i]['lng'],
        country: yearData[i]['country'],
        count: count[currentCity+currentCountry],
      })
  };

  function unique(arr){
    let unique = {};
    arr.forEach(function(item){
      unique[JSON.stringify(item)]=item;
    })
    arr = Object.keys(unique).map(function(u){
      return JSON.parse(u);
    })
    return arr;
  }

  const uniqueGroupByCity = unique(groupByCity);
  //console.log("This should be unique",uniqueGroupByCity);
  //==============data processing finished=====================



  const width = WIDTH - margin.left - margin.right;
  const height = HEIGHT - margin.top - margin.bottom;

  return <svg width={WIDTH} height={HEIGHT}>
    <g>
      <WorldMap map={map} projection={"geoEqualEarth"} width={width} height={height}
                data={rawData} location={uniqueGroupByCity} selectedCity={selectedCity}
                setSelectedCity={setSelectedCity}/>
    </g>
  </svg>
}

ReactDOM.render(
  <React.StrictMode>
    {/*<App />*/}
    <Geomap />

  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
