const mongoose = require("mongoose")

const Schema = new mongoose.Schema({
    Guild: String,
    Channel: String,
    Time: String
});

module.exports = mongoose.model("altidentifer", Schema);