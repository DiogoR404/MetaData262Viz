import './App.css';
import TestSearch from './components/TestSearch'

function App() {
  const url = window.location.href.slice(0,-5) + '5000/'
  return (
    <>
      <TestSearch url={url}/>
    </>
  );
}

export default App;
