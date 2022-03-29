import { useEffect, useState } from "react";
import axios from "axios";
import MultipleSelect from "./MultipleSelect";
import SingleSelect from "./SingleSelect";
import Button from "@mui/material/Button"

const TestSearch = ({ url }) => {
  const [version, setVersion] = useState('');
  const [presentType, setPresentType] = useState('Path');
  const [tests, setTests] = useState([]);
  const [selectedBuiltInBelong, setSelectedBuiltInBelong] = useState([]);
  const [selectedBuiltInContained, setSelectedBuiltInContained] = useState([]);
  const [listBuiltInsBelong, setListBuiltInsBelong] = useState([]);
  const [listBuiltInsContained, setListBuiltInsContained] = useState([]);
  const [listVersions, setListVersions] = useState([]);

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
      })
      .catch((e) => console.log(e))
  }

  return (
    <>
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
    <Button variant="contained" onClick={getTests}>Search</Button>

    <br />
    <br />
    <SingleSelect
      title='Result'
      list={['Path', 'JSON']}
      selection={presentType}
      setSelection={setPresentType}
      defaultValue='Path'
    />
    <br />
    <br />
    Number of tests: {tests.length}
    <br />
    Belong: [{selectedBuiltInBelong.join(',')}]
    <br />
    contained: [{selectedBuiltInContained.join(',')}]
    <br />
    <br />
    {presentType === 'Path' && 
      tests.map((item) => <p key={item._id}>{item.path}</p>)
    } 
    {presentType === 'JSON' && <pre>{JSON.stringify(tests, null, 4)}</pre> }
    </>
  )
}

export default TestSearch
