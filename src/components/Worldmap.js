import React from "react";
import {geoPath, geoEqualEarth, geoMercator} from "d3-geo";
import {scaleLinear, min, max} from "d3";

export function Worldmap(props) {
  const {map, projection, data, location, selectedCity, setSelectedCity} = props;

  // todo track browser window size && pass vh/vw from parent
  // const trans = geoEqualEarth().fitSize([1200, 900], map);
  const trans = geoEqualEarth();
  let path = geoPath(geoEqualEarth()); // the default projection

  if (projection === "geoEqualEarth") {
    path = geoPath(trans);
  }
  if (projection === "geoMercator") {
    path = geoPath(geoMercator());
  }

  const mouseOver = (d) => {
    setSelectedCity(d);
    // console.log(d);
  }
  const mouseOut = () => {
    setSelectedCity(null);
  }

  const radius = scaleLinear().range([3, 12])
    .domain([min(location, d => d.count), max(location, d => d.count)]);
  const getColor = (selectedCity, d) => {
    return selectedCity && d.city === selectedCity.city && d.country === selectedCity.country ? "red" : "steelblue";
  }

  return (
    <g>
      <path className={'sphere'} d={path({type: 'Sphere'})}/>
      {map.features.map(feature => {
          return <path key={feature.properties.name + "boundary"} className={"boundary"}
                       d={path(feature)}/>
        }
      )}
      {location.map(d => {
        const [x, y] = trans([d.lng, d.lat]);
        return <circle key={"station" + d.city + d.country} cx={x} cy={y} r={radius(d.count)} opacity={0.7}
                       fill={getColor(selectedCity, d)} onMouseOver={() => {
          mouseOver(d)
        }} onMouseOut={mouseOut}/>
      })}
    </g>
  );
}




