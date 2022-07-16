# to run
in the frontend folder
> npm start

in the backend folder
> node app.js

to import json file to database
> mongosh metadata --eval 'db.metadata.drop()' && mongoimport --db metadata --collection metadata --file MetaData262/metadata_version.json --jsonArray