const {authenticateToken} = require("./middleware");

function configureTweetDB(app, Tweet, Profile) {
    app.get('/tweets', authenticateToken, async (req, res) => {
        try {
            console.log('Fetching tweets...');
            const tweets = await Tweet.find().exec();
            console.log('Tweets:', tweets);
            res.status(200).json(tweets);
        } catch (error) {
            console.error('Error fetching tweets:', error);
            res.status(500).json({error: 'Failed to fetch tweets'});
        }
    });

    app.post('/tweets', authenticateToken, async (req, res) => {
        // request
        console.log('Request body:', req.body)
        const {messageID, handle, content} = req.body;
        console.log(req.body)
        console.log('Message ID:', messageID, 'Handle:', handle, 'Content:', content)
        const tweet = new Tweet({messageID, handle, content});

        try {
            const savedTweet = await tweet.save();
            console.log('Saved tweet:', savedTweet);

            const profile = await Profile.findOne({ handle }).exec();

            if (profile) {
                profile.tweets.push({messageID});
                await profile.save();
            }
            res.json(savedTweet);
        } catch (error) {
            console.error('Error saving tweet:', error);
            res.status(500).json({error: 'Failed to save tweet'});
        }
    });

    app.get('/tweets/:handle', authenticateToken, async (req, res) => {
        const {handle} = req.params;

        try {
            const profile = await Profile.findOne({ handle }).exec();

            if (profile) {
                res.json(profile.tweets);
            } else {
                res.json([]);
            }
        } catch (error) {
            console.error('Error fetching tweets:', error);
            res.status(500).json({ error: 'Failed to fetch tweets' });
        }
    });




    app.get('/tweet/:id', async (req, res) => {
        const { id } = req.params;

        try {
            const tweet = await Tweet.findOne({ id });

            if (!tweet) {
                return res.status(404).json({ error: 'User not found' });
            }

            const tweetData = {
                messageID: tweet.messageID,
                handle: tweet.handle,
                content: tweet.content,
                createdAt: tweet.createdAt,
            }

            res.status(200).json(tweetData);
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ error: 'Server error' });
        }
    });
}

module.exports = {
    configureTweetDB,
};
