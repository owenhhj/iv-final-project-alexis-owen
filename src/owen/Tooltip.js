import './Tooltip.css';
import {csv} from 'd3';
import {useEffect, useState} from "react";

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
      <div className={'tooltip-row'}>
        <p>{title}</p>
      </div>
      <div className={'tooltip-row'}>
        <p>{city}</p>
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
  console.log(uni.link, uni.logo)

  // xg7: try PyQt to fake a browser and visit the url

  return (
    <div className={'TooltipUniEntry'}>
      <div className={'logo-and-name'}>
        <img src={uni.logo} alt=""/>
        <p>{uni.university}</p>
      </div>
      <div>

      </div>
    </div>
  );
}

