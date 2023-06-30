const mongoose = require("mongoose")

const Schema = new mongoose.Schema({
    Guild: String,
    Message: String,
    Channel: String,
    Roles: Object,
});

module.exports = mongoose.model("buttonroles", Schema);
