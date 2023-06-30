const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    Guild: { type: String, required: true },
    User: { type: String, required: true },
    Cases: { type: Object, default: {} },
})

module.exports = mongoose.model("warns", Schema);