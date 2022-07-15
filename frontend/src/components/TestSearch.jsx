import { useEffect, useState } from "react";
import axios from "axios";
import MultipleSelect from "./MultipleSelect";
import SingleSelect from "./SingleSelect";
import DisplayTests from "./DisplayTests";
import DisplayStatistics from "./DisplayStatistics";

import Button from "@mui/material/Button"
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';

const TestSearch = ({ url }) => {
  const [version, setVersion] = useState('');
  const [fetchedTests, setFetchedTests] = useState(false);
  const [presentType, setPresentType] = useState('Path');
  const [builtInGrouping, setBuiltInGrouping] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [allTests, setAllTests] = useState([]);
  const [selectedBuiltInBelong, setSelectedBuiltInBelong] = useState([]);
  const [selectedBuiltInContained, setSelectedBuiltInContained] = useState([]);
  const [listBuiltInsBelong, setListBuiltInsBelong] = useState([]);
  const [listBuiltInsContained, setListBuiltInsContained] = useState([]);
  const [listVersions, setListVersions] = useState([]);
  const [hasFirstSearch, setHasFirstSearch] = useState(false);
  const [stopWatch, setStopWatch] = useState(0);

  // fetch info for query from database
  useEffect(() => {
    const sw = Date.now();
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
        console.log('inicial search fetches: ' + String(Date.now() - sw));
      }))
      .catch(e => console.log(e));

    axios.get(url + 'allTests/')
      .then((resp) => {
        setAllTests(resp.data);
        setFetchedTests(true);
        console.log('inicial tests fetch: ' + String(Date.now() - sw));

      }).catch(e => console.log(e));


  }, [url]);

  const getSearchResultsBackend = () => {
    const sw = Date.now();
    setSearchResults([]);
    const query = {
      version: version,
      builtIn: selectedBuiltInBelong,
      builtIn2: selectedBuiltInContained,
      builtInGrouping: builtInGrouping
    };

    axios.post(url + 'test/', query)
      .then((result) => {
        setSearchResults(result.data);
        setHasFirstSearch(true);
        setStopWatch(Date.now() - sw);
      })
      .catch((e) => console.log(e))
  }

  const getSearchResultsFrontend = () => {
    const sw = Date.now();
    const oneBuiltInEmpty = selectedBuiltInBelong.length === 0 || selectedBuiltInContained.length === 0;

    const filterBuiltInContained = (test) => {
      if (selectedBuiltInContained.length === 0) return true;

      let ret = false;
      selectedBuiltInContained.forEach((el) => {
        if (test['builtIns'] && Object.keys(test['builtIns']).includes(el)) {
          ret = true;
        }
      });
      return ret;
    };

    const filterBuiltInBelong = (test) => {
      return selectedBuiltInBelong.length === 0 || selectedBuiltInBelong.includes(test['built-ins'])
    }

    const filterBuiltIn = (test) => {
      return builtInGrouping || oneBuiltInEmpty ?
        filterBuiltInBelong(test) && filterBuiltInContained(test)
        : filterBuiltInBelong(test) || filterBuiltInContained(test);
    }


    const result = allTests
      .filter(test => { return version === '' || Number(test.version) === version })
      .filter(filterBuiltIn);
    setSearchResults(result);
    setHasFirstSearch(true);
    setStopWatch(Date.now() - sw);
  }

  return (
    <>
      <CssBaseline enableColorScheme />
      <Container align="center">
        <Typography variant='h2' component='h1'>MetaData262Viz</Typography>
        <Box>
          <Box>
            <MultipleSelect
              title='BuiltIn Belongs'
              list={listBuiltInsBelong}
              selection={selectedBuiltInBelong}
              setSelection={setSelectedBuiltInBelong}
            />
            <ToggleButtonGroup
              sx={{ mt: 1 }}
              exclusive
              value={builtInGrouping}
              onChange={(_e, type) => {if(type !== null) setBuiltInGrouping(type)}}
              arial-label='Relation type'
            >
              <ToggleButton value={true} aria-label='And'>And</ToggleButton>
              <ToggleButton value={false} aria-label='Or'>Or</ToggleButton>
            </ToggleButtonGroup>
            <MultipleSelect
              title='BuiltIn Contained'
              list={listBuiltInsContained}
              selection={selectedBuiltInContained}
              setSelection={setSelectedBuiltInContained}
            />
          </Box>
          <Box>
            <SingleSelect
              title='Version'
              list={listVersions}
              selection={version}
              setSelection={setVersion}
            />
            <Button sx={{ m: 2 }} size="large" variant="contained" onClick={getSearchResultsBackend}>BackEnd Search</Button>
            <Button
              sx={{ m: 2 }}
              size="large"
              variant="contained"
              onClick={getSearchResultsFrontend}
              disabled={!fetchedTests}
            >Local Search</Button>
          </Box>
        </Box>

        {hasFirstSearch && <Box textAlign='left' sx={{ mt: 2 }}>
          <ToggleButtonGroup
            sx={{ ml: 2 }}
            exclusive
            value={presentType}
            onChange={(_e, type) => {if(type !== null) setPresentType(type);}}
            arial-label='Presentation type'
          >
            <ToggleButton value='Path' aria-label='Path'>Path</ToggleButton>
            <ToggleButton value='JSON' aria-label='JSON'>JSON</ToggleButton>
            <ToggleButton value='STATS' aria-label='STATS'>STATS</ToggleButton>
          </ToggleButtonGroup>
          <Box >
            <Typography variant='h6' component='h3'>time to search: {stopWatch}</Typography>
            <Typography variant='h6' component='h3'>Number of tests: {searchResults.length}</Typography>
            {presentType !== 'STATS' && <Box>
              <DisplayTests tests={searchResults} presentType={presentType} />
            </Box>}
            {presentType === 'STATS' && <Box>
              <DisplayStatistics tests={searchResults} />
            </Box>}
          </Box>
        </Box>}
      </Container>
    </>
  )
}

export default TestSearch
