import React, {useState} from "react";
import './Geomap.css';
import {Worldmap} from "./Worldmap";
import {Barchart} from "./Barchart";
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

  const WIDTH_MAP = 950;
  const HEIGHT_MAP = 550;
  const PADDING_MAP = 20;
  const HEIGHT_BAR = 280;
  const PADDING_BAR = 40;

  const [rankLimit, setRankLimit] = useState(2);
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

  // =============slider=============
  const changeHandler = (event) => {
    setRankLimit(event.target.value);
  }
  // const RANKLIMIT = [200, 150, 100, 50]
  const RANKLIMIT = [50, 100, 150, 200];
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

  return (
    <div className={'Geomap'}>

      <div className={'geomap-slider card'}>
        <input
          id={'inputSlider'} key="slider" type='range' min={0} max={3} value={rankLimit} step={1}
          onChange={changeHandler}
        />
        <p>Top {RANKLIMIT[rankLimit]} universities in 2022</p>
      </div>

      <div className={'geomap-svg-map card'}>
          <svg width={WIDTH_MAP} height={HEIGHT_MAP}>
              <Worldmap
                map={map} projection={"geoEqualEarth"}
                MAP_WIDTH={WIDTH_MAP - PADDING_MAP} MAP_HEIGHT={HEIGHT_MAP - PADDING_MAP} PADDING={PADDING_MAP}
                data={yearData} location={uniqueGroupByCity} selectedCity={selectedCity}
                setSelectedCity={setSelectedCity}
              />
          </svg>
      </div>

      <div className={'geomap-svg-map card'}>
        <svg width={WIDTH_MAP} height={HEIGHT_BAR}>
          <Barchart
            offsetX={PADDING_BAR} offsetY={PADDING_BAR}
            height={HEIGHT_BAR-PADDING_BAR*2} width={WIDTH_MAP-PADDING_BAR}
            data={yearData} location={uniqueGroupByCity}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
          />
        </svg>
      </div>

    </div>
  );
}










