import './Tooltip.css';
import {csv} from 'd3';
import {useEffect, useState} from "react";
import {legalize_name} from "../CommonFunctions";

export function useData(csvPath = './qs ranking 200 with location.csv', row = 3, year = 2022) {
  const [dataAll, setDataAll] = useState([]);
  useEffect(() => {
    let temp = [];
    csv(csvPath).then(data => {
      data.forEach(row => {
        if (row.year === year.toString()) {
          temp.push(row);
        }
      });
    });
    setDataAll(temp);
  }, []);
  return dataAll;
}

export default function Tooltip({
                                  title = 'Default Tooltip Title',
                                  selectedCity  // can be an object or null
                                }) {
  let data = useData();

  return (
    <div className={'Tooltip card non-text'}>
      {selectedCity && (
        <>
          <div className={'tooltip-row-title'}>
            <p>Top Universities in {selectedCity.city}</p>
          </div>

          <hr/>

          {data
            .filter(row => row.city === selectedCity.city && row.country === selectedCity.country)
            .map((uni, index) => {
              return (
                <TooltipUniEntry key={index} uni={uni}/>
              );
            })}

        </>
      )}
    </div>
  );
};

function TooltipUniEntry({
                           uni = {}
                         }) {
  const [imgURL, setImgURL] = useState('./logo192.png');

  useEffect(() => {
    let name = legalize_name(uni.university);
    let temp = `./uni-logos/${name}.jpg`;
    setImgURL(temp);
  }, []);

  return (
    <div className={'TooltipUniEntry card'}>
      <div className={'half-logo-name'}>
        <img src={imgURL} alt=""/>
        <p>{uni.university}</p>
      </div>
      <div className={'half-rank'}>
        <p>{uni.rank_display}</p>
      </div>
    </div>
  );
}
