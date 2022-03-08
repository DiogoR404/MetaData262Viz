import './App.css';
import StudentSearch from './components/StudentSearch'
import StudentAdd from './components/StudentAdd'

function App() {
  const url = 'http://localhost:5000/'
  return (
    <>
      <StudentSearch url={url}/>
      <br />
      <br />
      <StudentAdd url={url}/>
    </>
  );
}

export default App;
