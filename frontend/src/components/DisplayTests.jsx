import { useState } from "react";
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Pagination from "@mui/material/Pagination";

const DisplayTests = ({ tests, presentType }) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;


  const displayTest = (test, presentType) => {
    if (presentType === 'Path') {
      return test.path;
    } else {
      return (
        <pre style={{ width: '100%', overflow: 'auto', fontFamily: 'inherit'}}>
          {JSON.stringify(test, null, 4)}
        </pre>
      );
    }
  }
  return (
    <>
      <Stack spacing={2}>
        {tests.slice(itemsPerPage * (page-1), itemsPerPage * page).map((test) => {
          return (
            <Paper elevation={2} key={test._id}>
              <Typography variant='subtitle1' content='p'>
                {displayTest(test, presentType)}
              </Typography>
            </Paper>
          )
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
