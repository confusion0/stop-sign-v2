const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    Guild: String,
    Channel: String,
    Enabled: { type: Boolean, default: false },
    Users: Object,
    BonusRoles: Array,
    RewardRoles: Object
})

module.exports = mongoose.model("experience", Schema);
