import './LineChartSection.css';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import {Linechart} from "./Linechart";
import {useState} from "react";
import {COLORS, useLocation} from "../CommonFunctions";

export default function LineChartSection() {
  const [uniNamesSelected, setUniNamesSelected] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState('-1');
  const uniNameOptions = useLocation()
    .map(row => row.university)
    .filter((uni, idx, self) => {return self.indexOf(uni)===idx});

  const handleUniSelect = (e, v) => {
    setUniNamesSelected(v);
  };

  const handleMouseEnter = (e) => {
    setHoveredIndex(e.target.getAttribute('itemID'));
  };

  const handleMouseLeave = (e) => {
    setHoveredIndex('-1');
  };

  return (
    <div className={'LineChartSection card'}>
      <div className={'tooltip-row-title'}>
        <p>Rankings Over the Past Six Years (Top 200)</p>
      </div>
      <hr/>
      <div className={'LineChartSection-row-selector'}>
        <Autocomplete
          multiple
          id="tags-standard"
          size={"small"}
          options={uniNamesSelected.length < 3 ? uniNameOptions : []}
          onChange={handleUniSelect}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Select up to 3 universities"
              placeholder=""
            />
          )}
        />
      </div>

      <div className={'LineChartSection-row-graph'}>
        <Linechart selectedUniversities={uniNamesSelected} hoveredIndex={hoveredIndex} setHoveredIndex={setHoveredIndex}/>
      </div>

      {uniNamesSelected.map((uni, index) => {
        return (
          <div
            className={'TooltipUniEntry card'} key={index}
            style={index.toString() === hoveredIndex ? {boxShadow: '0 2px 8px #BBBBBB'} : {}}
            itemID={index.toString()} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
          >
            <svg style={{height: '2.5em', width: '2.5em', margin: '0', borderRadius: '5px'}}>
              <rect x={0} y={0} width={'100%'} height={'100%'} fill={COLORS.slice(index)[0]}/>
            </svg>
            <div className={'half-logo-name'}>
              <p>{uni}</p>
            </div>
          </div>
        );
      })}

    </div>
  );
};










