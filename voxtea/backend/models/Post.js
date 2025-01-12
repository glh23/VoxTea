const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    description: { type: String, required: true },
    audioFile: { type: String, required: true }, // Path to MP3 file
    userId:{type:String, required: true} 
}, { timestamps: true }); // Adds `createdAt` and `updatedAt` fields

module.exports = mongoose.model('Post', postSchema);
