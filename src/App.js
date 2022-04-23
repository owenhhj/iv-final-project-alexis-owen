import './App.css';
import Geomap from "./components/Geomap";
import Tooltip from "./owen/Tooltip";
import {useState} from "react";

function App() {
  const [selectedCity, setSelectedCity] = useState(null);

  return (
    <div className={'App'}>
      <Geomap selectedCity={selectedCity} setSelectedCity={setSelectedCity}/>
      <Tooltip selectedCity={selectedCity}/>
    </div>
  );
}

export default App;













