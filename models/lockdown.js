const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    Guild: { type: String, required: true },
    Lockdown: {
        Enabled: { type: Boolean, default: false },
	    Channels: { type: Array, default: [] },
        Message: { type: String, default: 'This channel is locked down.' },
    }
})

module.exports = mongoose.model("lockdown", Schema);