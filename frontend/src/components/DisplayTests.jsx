import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const DisplayTests = ({ tests, presentType }) => {
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
        {tests.map((test) => {
          return (
            <Paper elevation={2} key={test._id}>
              <Typography variant='subtitle1' content='p'>
                {displayTest(test, presentType)}
              </Typography>
            </Paper>
          )
        })}
      </Stack>
    </>
  );
}
export default DisplayTests