import './App.css';
import TestSearch from './components/TestSearch'

function App() {
  const url = 'http://localhost:5000/'
  return (
    <>
      <TestSearch url={url}/>
    </>
  );
}

export default App;
