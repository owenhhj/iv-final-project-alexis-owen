import React, {useState} from "react";
import './Geomap.css';
import {Worldmap} from "./Worldmap";
import {Barchart} from "./Barchart";
import {useLocation, useMap} from "../CommonFunctions";

const mapUrl = './countries-110m.json';
const csvUrl = './qs ranking 200 with location.csv';

export default function Geomap({
                                 RANKLIMIT,
                                 rankLimit,
                                 setRankLimit,
                                 selectedCity,
                                 setSelectedCity
                               }) {
  const WIDTH_MAP = 950;
  const HEIGHT_MAP = 550;
  const PADDING_MAP = 20;
  const HEIGHT_BAR = 280;
  const PADDING_BAR = 40;

  // const [rankLimit, setRankLimit] = useState(2);
  const rawData = useLocation(csvUrl);
  const map = useMap(mapUrl);
  //==============data processing=====================
  if (!map || !rawData) {
    return <pre>Loading...</pre>;
  }

  const rawYearData = rawData.filter(d => {
    return d.year === 2022;
  });

  // =============slider=============
  const changeHandler = (event) => {
    setRankLimit(event.target.value);
  }
  // const RANKLIMIT = [50, 100, 150, 200];
  const yearData = rawYearData.filter(d => {
    return d.ranking <= RANKLIMIT[rankLimit];
  });

  const cityData = [];
  for (let i = 0; i < yearData.length; i++) {
    const city = yearData[i]['city']
    const country = yearData[i]['country']
    cityData.push(city + country)
  }

  const count = {};
  for (const element of cityData) {
    if (count[element]) {
      count[element] += 1;
    } else {
      count[element] = 1;
    }
  }

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
            height={HEIGHT_BAR - PADDING_BAR * 2} width={WIDTH_MAP - PADDING_BAR}
            data={yearData} location={uniqueGroupByCity}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
          />
        </svg>
      </div>

    </div>
  );
}










