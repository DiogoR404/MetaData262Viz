const mongoose = require('mongoose')

const testMetadataSchema = new mongoose.Schema({
    'pathSplit': [String],
    'version': Number,
    'builtIns': Object,
    'path': String
})

module.exports = mongoose.model('TestMetadata', testMetadataSchema, 'metadata')