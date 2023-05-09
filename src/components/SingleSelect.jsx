import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const SingleSelect = ({ title, list, selected, setSelection , defaultValue=''}) => {
  return (
    <>
    <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="label">{title}</InputLabel>
      <Select
        labelId="label"
        id="select"
        value={selected}
        label="select-label"
        onChange={(e) => setSelection(e.target.value)}
        defaultValue={defaultValue}
      >
        {defaultValue === '' && <MenuItem  value=''>None</MenuItem>}
        {list.map((elm) => {
          return <MenuItem key={elm} value={elm}>{elm}</MenuItem>
        })}
      </Select>
    </FormControl>
    </>
  );
}
export default SingleSelect