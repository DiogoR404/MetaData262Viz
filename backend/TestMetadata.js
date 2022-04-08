const mongoose = require('mongoose')

const testMetadataSchema = new mongoose.Schema({
    'built-ins': {
        type: String,
        required: false
    },
    'version': {
        type: Number,
        required: false
    },
    'builtIns': {
        type: Object,
        required: false
    }
})

module.exports = mongoose.model('TestMetadata', testMetadataSchema, 'metadata')