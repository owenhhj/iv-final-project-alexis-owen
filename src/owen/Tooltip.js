import './Tooltip.css';
import {csv} from 'd3';
import {useEffect, useState} from "react";
import {legalize_name} from "../CommonFunctions";

function useData(csvPath, row=3) {
  const [dataAll, setData] = useState(null);
  useEffect(() => {
    csv(csvPath).then(data => {
      setData(data.slice(0, row));
    });
  }, []);
  return dataAll;
}

export default function Tooltip({
  title='Default Tooltip Title',
  city='Shanghai',
  schoolsData=[]
                                }) {
  let data = useData('./data.csv')

  return (
    <div className={'Tooltip card non-text'}>
      <div className={'tooltip-row-title'}>
        <p>Top Universities in {city}</p>
      </div>

      {data && data.map((uni, index) => {
        return (
          <TooltipUniEntry key={index} uni={uni}/>
        );
      })}

    </div>
  );
};

function TooltipUniEntry({
  uni={}
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

