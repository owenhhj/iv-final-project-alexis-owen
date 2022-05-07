import './LineChartSection.css';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import {Linechart} from "./Linechart";
import {useState} from "react";
import {useLocation} from "../CommonFunctions";

const fakeUniOptions = [
  'New York University',
  'Massachusetts Institute of Technology (MIT) ',
  'University of Illinois at Urbana-Champaign'
];

export default function LineChartSection() {
  const [uniNamesSelected, setUniNamesSelected] = useState([]);
  const uniNameOptions = useLocation()
    .map(row => row.university)
    .filter((uni, idx, self) => {return self.indexOf(uni)===idx});

  const handleUniSelect = (e, v) => {
    setUniNamesSelected(v);
  };

  return (
    <div className={'LineChartSection card'}>

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
        <Linechart selectedUniversities={uniNamesSelected}/>
      </div>

    </div>
  );
};










