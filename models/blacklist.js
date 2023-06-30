const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    Guild: String,
    Words: Array,
    Punishment: String,
})

module.exports = mongoose.model("blacklisted-words", Schema);
