const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    description: { type: String, required: true },
    audioFile: { type: String, required: true }, // Path to MP3 file
});

module.exports = mongoose.model('Post', postSchema);
