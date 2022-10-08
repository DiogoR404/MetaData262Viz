const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const TestMetadata = require('./TestMetadata');

const app = express()
const port = 5000

mongoose.set('debug', true);
mongoose.connect('mongodb://127.0.0.1:27017/metadata');

app.use(cors())
app.use(express.json());


// get distinct of database key
const getDistinct = async (key) => {
  return await TestMetadata.distinct(key)
    .then((res) => { return res; })
};


// function for testing
app.get('/', async (_, res) => {
  const cursor = TestMetadata.find({}).cursor();
  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    console.log(doc.get('path'));
  }
  res.send('end');
});


// get the whole database
app.get('/allTests', async (_, res) => {
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


// get all built-ins (subfolder of built-in directory)
app.get('/getBuiltIns', async (_, res) => {
  const paths = await TestMetadata.find({pathSplit:'built-ins'},{pathSplit:1, _id:0})
  let distinct = new Set();
  paths.forEach(elm => {distinct.add(elm.pathSplit[1])}) 
  res.send([...distinct]);
});


// get all builtIns
app.get('/getBuiltIns2', async (_, res) => {
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


// get all versions
app.get('/getVersions', async (_, res) => {
  res.send(await getDistinct('version'));
});

app.get('/countTestsPerVersion', async(_, res) => {
  const query =await TestMetadata.find({pathSplit:'built-ins'},{pathSplit:{$slice:[1,1]},version:1,_id:0});

  table = [['subfolder'] + (await getDistinct('version'))]
  res.send(table)

});

// start server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
