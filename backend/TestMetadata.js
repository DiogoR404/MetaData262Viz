const mongoose = require('mongoose')

const testMetadataSchema = new mongoose.Schema({
    path: {
        type: String,
        required: true
    },
    esid: {
        type: String,
    },
    description: {
        type: String,
    },
    'built-ins': {
        type: String,
    },
    version: {
        type: Number,
    },
    esprima: {
        type: String,
        required: true
    },
    builtIns: {
        type: Object,
    },
    lines: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('TestMetadata', testMetadataSchema, 'metadata')