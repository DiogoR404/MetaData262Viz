import { useEffect, useState } from "react";
import axios from "axios";
import pako from "pako";
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

    axios.get(url + 'getZip/', { responseType: 'arraybuffer' })
      .then((resp) => {
        console.log('inicial tests fetch: ' + String(Date.now() - sw));
        const inflated = pako.inflate(resp.data, {to: 'string'});
        const tests = JSON.parse(inflated.slice(inflated.indexOf('['), inflated.lastIndexOf(']') +1));
        setAllTests(tests);
        const versions = new Set();
        const builtIns = new Set();
        const folders = new Set();
        tests.forEach(test => {
          if (test.version) versions.add(test.version);
          if (test.hasOwnProperty('built-ins')) Object.keys(test['built-ins']).forEach(builtIn => builtIns.add(builtIn));
          folders.add(test.pathSplit[1]);
        });
        setListVersions([...versions].sort((a,b) => {return a-b;}));
        setListBuiltInsBelong([...folders].sort());
        setListBuiltInsContained([...builtIns].sort());


        setFetchedTests(true);
        console.log('final tests fetch: ' + String(Date.now() - sw));

      }).catch(e => console.log(e));
      
      setListBuiltInsBelong([])
      setListBuiltInsContained([])
      setListVersions([])

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
        if (test['built-ins'] && Object.keys(test['built-ins']).includes(el)) {
          ret = true;
        }
      });
      return ret;
    };

    const filterBuiltInBelong = (test) => {
      return selectedBuiltInBelong.length === 0 || selectedBuiltInBelong.includes(test['pathSplit'][1])
    }

    const filterBuiltIn = (test) => {
      return builtInGrouping || oneBuiltInEmpty ?
        filterBuiltInBelong(test) && filterBuiltInContained(test)
        : filterBuiltInBelong(test) || filterBuiltInContained(test);
    }


    const result = allTests
      .filter(test => { return version === '' || parseInt(test.version) === version })
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
