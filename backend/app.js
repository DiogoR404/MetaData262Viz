const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.set('debug', true);
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

const inv = ['./test262-main/test/built-ins/Object/prototype/hasOwnProperty/not-a-constructor.js',
    './test262-main/test/built-ins/Object/prototype/hasOwnProperty/length.js',
    './test262-main/test/built-ins/Object/prototype/hasOwnProperty/topropertykey_before_toobject.js',
  ]

  const vali = ['./test262-main/test/built-ins/Array/S15.4.3_A1.1_T3.js']

app.get('/', async (req, res) => {
  
  // res.send(await TestMetadata.find({ path: './test262-main/test/built-ins/Object/prototype/hasOwnProperty/not-a-constructor.js'}));
  // res.send(await TestMetadata.find({}));
  const cursor = TestMetadata.find({}).cursor();
  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    console.log(doc.get('path'));
  }
  res.send('end');
});

app.get('/allTests', async (req, res) => {
  res.send(await TestMetadata.find({})) ;
});

// query the database to get the tests
app.post('/test', async (req, res) => {
  const n = Date.now();
  let query = {};
  
  if (req.body.version) {
    query.version = req.body.version;
  };
  
  if (req.body.builtIn.length !== 0 || req.body.builtIn2.length !== 0) {
    const arr = [];
    if (req.body.builtIn.length !== 0) {
      arr.push({'built-ins': {'$in': req.body.builtIn}});
    };
    
    if (req.body.builtIn2.length !== 0) {
      arr.push({'$or': req.body.builtIn2.map((elm) => {
        return {['builtIns.' + elm] : {'$exists': true}};
      })});
    };
    if (req.body.builtInGrouping) {
      query['$and'] = arr;
    } else {
      query['$or'] = arr;
    } 
  };
  
  res.send(await TestMetadata.find(query));
  console.log(Date.now() - n);
});

app.get('/getBuiltIns', async (req, res) => {
  res.send(await getDistinct('built-ins'));
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
});

app.get('/getVersions', async (req, res) => {
  res.send(await getDistinct('version'));
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
