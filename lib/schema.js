const mongoose = require('mongoose');
const uri = 'mongodb+srv://shashank:qwerty123@tweets.ak6sfx4.mongodb.net/';

function connectToMongoDB() {
    return mongoose
        .connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
}

// Create a Tweet schema and model
const tweetSchema = new mongoose.Schema({
    messageID: { type: String, unique: true },
    handle: String,
    content: String,
    createdAt: {type: Date, default: Date.now},
});

// Credential schema and model
const userSchema = new mongoose.Schema({
    _id: { type: String, unique: true },
    handle: String,
    imageUrl: { type: String, default: null },
    name: String,
    joined: Date,
    bio: { type: String, default: null },
    dob: { type: Date, default: null },
    location: { type: String, default: null },
    wallpaperUrl: { type: String, default: null },
});

const credSchema = new mongoose.Schema({
    handle: { type: String, unique: true },
    password: String,
});

const followSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    followee: String,
    follower: String,
});


const Credential = mongoose.model('Credential', credSchema);
const User = mongoose.model('User', userSchema);
const Tweet = mongoose.model('Tweet', tweetSchema);
const Follow = mongoose.model('Follow', followSchema);

module.exports = {
    connectToMongoDB,
    Tweet,
    Credential,
    User,
    Follow,
};
