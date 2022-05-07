import './LineChartSection.css';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import {Linechart} from "./Linechart";

const fakeUniNames = [{title: 'NYU'}, {title: 'NYUSH'}, {title: 'NYUAD'}];

export default function LineChartSection({
  uniNames=fakeUniNames,
                                         }) {


  const handleUniSelect = (e, v) => {
    console.log(v);
  };

  return (
    <div className={'LineChartSection card'}>
      <div className={'LineChartSection-row-selector'}>
        <Autocomplete
          multiple
          id="tags-standard"
          options={uniNames}
          getOptionLabel={(option) => option.title}
          limitTags={3}
          // defaultValue={}
          // isOptionEqualToValue={option => option.title}
          onChange={handleUniSelect}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Select one or more universities"
              placeholder=""
            />
          )}
        />
      </div>

      <Linechart/>

    </div>
  );
};










