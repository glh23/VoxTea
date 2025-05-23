const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    description: { type: String, required: true },
    audioFile: { type: String, required: true }, // Path to MP3 file
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    hashtags: [{ type: String }] 
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);