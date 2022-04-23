import './App.css';
import Geomap from "./components/Geomap";
import Tooltip from "./owen/Tooltip";
import {useState} from "react";

function App() {
  const [selectedCity, setSelectedCity] = useState(null);
  return (
    <>
      <Geomap selectedCity={selectedCity} setSelectedCity={setSelectedCity} />
      <Tooltip/>
    </>
  );
}

export default App;













