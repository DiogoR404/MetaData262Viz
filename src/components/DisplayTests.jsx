import { useState } from "react";
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Pagination from "@mui/material/Pagination";
import SyntaxHighlighter from 'react-syntax-highlighter'



const DisplayTests = ({ tests, presentType }) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const displayTest = (test, presentType) => {
    if (presentType === 'Path') {
      return (
        <>
        <Typography variant='subtitle1' content='p'>
        <Paper elevation={4} key={test._id}>
          <SyntaxHighlighter language="sh" wrapLongLines>
            {test.path}
          </SyntaxHighlighter>
        </Paper>
        </Typography>
        </>
      );
    }
    
    else {
      return (
      <>
      <Typography variant='subtitle1' content='p'>
        <Paper elevation={4} key={test._id}>
          <SyntaxHighlighter language="JSON" wrapLongLines>
            {JSON.stringify(test, null, 4)}
          </SyntaxHighlighter>
        </Paper>
        </Typography>
      </>
      );
    }
  }
  
  return (
    <>
      <Stack spacing={-1}>
        {tests.slice(itemsPerPage * (page-1), itemsPerPage * page).map((test) => {
          return  displayTest(test, presentType);
        })}
      </Stack>
      <Pagination
	page={page}
	onChange={(e, val) => setPage(val)}
	count={Math.ceil(tests.length / itemsPerPage)}
	sx={{m: 2, justifyContent: 'center', display: 'flex'}}
      />
    </>
  );
}
export default DisplayTests
