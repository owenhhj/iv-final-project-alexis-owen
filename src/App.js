import './App.css';
import Geomap from "./components/Geomap";
import Tooltip from "./components/Tooltip";
import LineChartSection from "./components/LineChartSection";
import {useState} from "react";

function App() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [rankLimit, setRankLimit] = useState(2);
  const RANKLIMIT = [50, 100, 150, 200];

  return (
    <div className={'App non-text'}>
      <div className={'grid-container'}>
        <div className={'grid-col1'}>
          <Geomap
            selectedCity={selectedCity} setSelectedCity={setSelectedCity}
            rankLimit={rankLimit} setRankLimit={setRankLimit} RANKLIMIT={RANKLIMIT}
          />
        </div>

        <div className={'grid-col2'}>
          <Tooltip
            selectedCity={selectedCity}
            rankLimit={rankLimit} RANKLIMIT={RANKLIMIT}
          />
          <LineChartSection/>
        </div>
      </div>

      <div className={'warning-msg card'}>
        <p style={{fontWeight: 'bold'}}>A message from Alexis & Owen:</p>
        <p>Please enlarge your browser window or zoom out!</p>
      </div>
    </div>
  );
}

export default App;













