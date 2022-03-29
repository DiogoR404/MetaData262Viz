import { useEffect, useState } from "react";
import axios from "axios";
import MultipleSelect from "./MultipleSelect";
import SingleSelect from "./SingleSelect";
import Button from "@mui/material/Button"
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';


const TestSearch = ({ url }) => {
  const [version, setVersion] = useState('');
  const [presentType, setPresentType] = useState('Path');
  const [tests, setTests] = useState([]);
  const [selectedBuiltInBelong, setSelectedBuiltInBelong] = useState([]);
  const [selectedBuiltInContained, setSelectedBuiltInContained] = useState([]);
  const [listBuiltInsBelong, setListBuiltInsBelong] = useState([]);
  const [listBuiltInsContained, setListBuiltInsContained] = useState([]);
  const [listVersions, setListVersions] = useState([]);
  const [hasFirstSearch, setHasFirstSearch] = useState(false);

  // fetch info for query from database
  useEffect(() => {
    const fetches = [
        axios.get(url + 'getBuiltIns'),
        axios.get(url + 'getVersions'),
        axios.get(url + 'getBuiltIns2'),
    ];
    axios.all(fetches)
      .then(axios.spread((...resp) => {
        setListBuiltInsBelong(resp[0].data);
        setListVersions(resp[1].data);
        setListBuiltInsContained(resp[2].data);
      })).catch(e => console.log(e))
    }, [url]);

  const getTests = () => {
    setTests([]);
    const query = {
      version: version,
      builtIn: selectedBuiltInBelong,
      builtIn2: selectedBuiltInContained
    };

    axios.post(url + 'test/', query)
      .then((result) => {
        setTests(result.data);
        setHasFirstSearch(true);
      })
      .catch((e) => console.log(e))
  }

  return (
    <>
    <CssBaseline enableColorScheme />
    <Container align="center">
      <Typography  variant='h2' component='h1'>Test 262 Database</Typography>
      <Box bgcolor='grey' >
        <MultipleSelect
          title='BuiltIn Belongs'
          list={listBuiltInsBelong}
          selection={selectedBuiltInBelong}
          setSelection={setSelectedBuiltInBelong}
        />  
        <MultipleSelect
          title='BuiltIn Contained'
          list={listBuiltInsContained}
          selection={selectedBuiltInContained}
          setSelection={setSelectedBuiltInContained}
        />
        <SingleSelect
          title='Version'
          list={listVersions}
          selection={version}
          setSelection={setVersion}
        />
        <Button size="large" variant="contained" onClick={getTests}>Search</Button>
      </Box>

      { hasFirstSearch && <Box>
        <ToggleButtonGroup
          exclusive
          value={presentType}
          onChange={(_e, type) => setPresentType(type)}
          arial-label='Presentation type'
        >
          <ToggleButton value='Path' aria-label='Path'>Path</ToggleButton>
          <ToggleButton value='JSON' aria-label='JSON'>JSON</ToggleButton>
        </ToggleButtonGroup>
        <Box textAlign='left'>
          <Typography variant='h6' component='h3'>Number of tests: {tests.length}</Typography>
          {presentType === 'Path' && 
            tests.map((item) => <p key={item._id}>{item.path}</p>)
          } 
          {presentType === 'JSON' && <pre>{JSON.stringify(tests, null, 4)}</pre> }
        </Box>
      </Box>}
    </Container>
    </>
  )
}

export default TestSearch
