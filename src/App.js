import './App.css';
import Geomap from "./components/Geomap";
import Tooltip from "./components/Tooltip";
import LineChartSection from "./components/LineChartSection";
import {useState} from "react";

function App() {
  const [selectedCity, setSelectedCity] = useState(null);

  return (
    <div className={'App non-text'}>
      <div className={'grid-container'}>
        <div className={'grid-col1'}>
          <Geomap selectedCity={selectedCity} setSelectedCity={setSelectedCity}/>
        </div>

        <div className={'grid-col2'}>
          <Tooltip selectedCity={selectedCity}/>
          <LineChartSection/>
        </div>
      </div>

      <div className={'warning-msg card'}>
        <p>A message from Alexis & Owen:</p>
        <p>Your browser window is too narrow...</p>
      </div>
    </div>
  );
}

export default App;













