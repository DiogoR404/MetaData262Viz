const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express()
const port = 5000

app.use(cors())
app.use(express.json());

const metadataCompressed = fs.readFileSync('metadata.tar.gz');

// get the zip file with all the metadata
app.get('/getZip', async (_, res) => {
  res.send(metadataCompressed);
});

// start server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
