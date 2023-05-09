import './App.css';
import TestSearch from './components/TestSearch'
import data from './data/metadata.json';

function App() {

  return (
    <>
      <TestSearch metadata={data}/>
    </>
  );
}

export default App;
