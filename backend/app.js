const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/metadata');
const TestMetadata = require('./TestMetadata');
const axios = require('axios');

const app = express()
const port = 5000

app.use(cors())
app.use(express.json());

const getDistinct = async (key) => {
  return await TestMetadata.distinct(key)
    .then((res) => { return res; })
};

app.get('/', async (req, res) => {
  res.send(await TestMetadata.find({'version': 10})) ;
});
app.get('/size', async (req, res) => {
  res.send(await TestMetadata.find({'version': 5})) ;
});

// query the database to get the tests
app.post('/test', async (req, res) => {
  const n = Date.now();
  const query = {};
  if (req.body.builtIn.length !== 0) {
    query['built-ins'] = {'$in': req.body.builtIn};
  };
  
  if (req.body.version) {
    query.version = Number(req.body.version);
  };
  //  db.metadata.find({'builtIns.Object': {$exists: true}})
  if (req.body.builtIn2.length !== 0) {
    query['$or'] = req.body.builtIn2.map((elm) => {
      return {['builtIns.' + elm] : {'$exists': true}};
    });
  };
  const ret = await TestMetadata.find(query);
  console.log(Date.now() - n);
  process.stdout.write(JSON.stringify(query, null, 2));
  res.send(ret);
  console.log(Date.now() - n);
});

app.get('/getBuiltIns', async (req, res) => {
  res.send(await getDistinct('built-ins'));
  console.log('/getBuiltIns');
});

app.get('/getBuiltIns2', async (req, res) => {
  const builtIns = await getDistinct('builtIns');
  const builtInsDiff = [];
  
  //get keys
  builtIns.forEach(element => {
    Object.keys(element).forEach(elm => {
      builtInsDiff.push(elm);
    });  
  });
  
  const comp = [...new Set(builtInsDiff)]; //remove duplicate
  res.send(comp.sort());
  console.log('/getBuiltIns2');
});

app.get('/getVersions', async (req, res) => {
  res.send(await getDistinct('version'));
  console.log('/getVersions');
});

app.get('/testAPI', async (req, res) => {
  const data = JSON.stringify({
    "collection": "metadata",
    "database": "metadata",
    "dataSource": "Metadata"
  });
  // const data = JSON.stringify({
  //   "collection": "metadata",
  //   "database": "metadata",
  //   "dataSource": "Metadata",
  //   stuff: 1,
  //   moreStuff: 'coisaisoas'
  // });

  const config = {
    method: 'post',
    url: 'https://data.mongodb-api.com/app/data-fiwyx/endpoint/data/beta/action/find',
    // url: 'https://data.mongodb-api.com/app/data-fiwyx/endpoint/data/beta/action/insertOne',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Request-Headers': '*',
      'api-key': '65WRxCUyVz3R3Lxpfd62jUt0dglFCibVHsEwSAoaDbQLKCdXuCQ2enL5H8JZCJye'
    },
    data: data
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
  res.send('End!')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
