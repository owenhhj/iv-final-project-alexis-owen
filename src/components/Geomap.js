import React, {useState} from "react";
import './Geomap.css';
import {Worldmap} from "./Worldmap";
import {Barchart} from "./Barchart";
import {Linechart} from "./Linechart";
import {csv, json} from "d3";
import * as topojson from "topojson-client";

const mapUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const csvUrl = "./qs ranking 200 with location.csv";

function useMap(jsonPath) {
  const [data, setData] = React.useState(null);
  React.useEffect(() => {
    json(jsonPath).then(topoJsonData => {
      setData(topojson.feature(topoJsonData, topoJsonData.objects.countries))
    });
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

export default function Geomap({
  selectedCity,
  setSelectedCity
                               }) {

  const WIDTH = 1000;
  const HEIGHT = 800;
  const margin = {left: 50, right: 50, top: 50, bottom: 50, gap: 50};

  const [rankLimit, setRankLimit] = useState('0');
  const rawData = useLocation(csvUrl);
  const map = useMap(mapUrl);
  //==============data processing=====================
  if (!map || !rawData) {
    return <pre>Loading...</pre>;
  }

  // console.log(rawData, map);

  const rawYearData = rawData.filter(d => {
    return d.year === 2022;
  });
  //console.log(yearData, map);

  // =============input box============
  // 请帮我写个input box！
  const selectedUniversity = "New York University (NYU)"
  const universityData = rawData.filter(d => {
    return d.university === selectedUniversity;
  });

  // =============slider=============
  const changeHandler = (event) => {
    setRankLimit(event.target.value);
  }
  const RANKLIMIT = [200, 150, 100, 50]
  const yearData = rawYearData.filter(d => {
    return d.ranking <= RANKLIMIT[rankLimit];
  });


  const cityData = [];
  for (let i = 0; i < yearData.length; i++) {
    const city = yearData[i]['city']
    const country = yearData[i]['country']
    cityData.push(city + country)
  }
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
  for (let i = 0; i < yearData.length; i++) {
    const currentCity = yearData[i]['city']
    const currentCountry = yearData[i]['country']
    groupByCity.push({
      city: yearData[i]['city'],
      lat: yearData[i]['lat'],
      lng: yearData[i]['lng'],
      country: yearData[i]['country'],
      count: count[currentCity + currentCountry],
    })
  }

  function unique(arr) {
    let unique = {};
    arr.forEach(function (item) {
      unique[JSON.stringify(item)] = item;
    })
    arr = Object.keys(unique).map(function (u) {
      return JSON.parse(u);
    })
    return arr;
  }

  const uniqueGroupByCity = unique(groupByCity);
  //console.log("This should be unique",uniqueGroupByCity);
  //==============data processing finished=====================


  const mapWidth = 900
  const mapHeight = 400

  return (
    <div className={'Geomap'}>
      <div>
        <input key="slider" type='range' min='0' max='3' value={rankLimit} step='1' onChange={changeHandler}/>
        <input key="monthText" type="text" value={RANKLIMIT[rankLimit]} readOnly/>
      </div>
      <svg width={WIDTH} height={HEIGHT}>
        <g>
          <Worldmap map={map} projection={"geoEqualEarth"}
                    data={yearData} location={uniqueGroupByCity} selectedCity={selectedCity}
                    setSelectedCity={setSelectedCity}/>
          <Barchart offsetX={margin.left} offsetY={margin.top + mapHeight + margin.gap}
                    height={150} width={mapWidth}
                    data={yearData} location={uniqueGroupByCity}
                    selectedCity={selectedCity}
                    setSelectedCity={setSelectedCity}/>
          <Linechart offsetX={margin.left} offsetY={margin.top} width={300} height={200} data={universityData}/>
        </g>
      </svg>
    </div>
  );
}










