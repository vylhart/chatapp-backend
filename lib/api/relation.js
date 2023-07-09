const {authenticateToken} = require("../middleware");

function configureRelation(app, Follow) {
    app.get('/followers/:handle', authenticateToken, async (req, res) => {
        const { handle } = req.params;
        console.log("getting followers for " + handle);
        try {
            const followers = await Follow.find({followee: handle}).exec();
            console.log(followers);
            res.status(200).json(followers);
        } catch (err) {
            console.log("error getting followers", err);
            res.status(500).json({error: err.message});
        }
    });

    app.get('/followees/:handle', authenticateToken, async (req, res) => {
        const { handle } = req.params;
        console.log("getting followees for " + handle);
        try {
            const followers = await Follow.find({follower: handle}).exec();
            console.log(followers);
            res.status(200).json(followers);
        } catch (err) {
            console.log("error getting followees", err);
            res.status(500).json({error: err.message});
        }
    });

    app.post('/follow', authenticateToken, async (req, res) => {
        const { id, follower, followee } = req.body;
        console.log("following " + followee + " from " + follower);
        try {
            const follow = new Follow({id, follower, followee});
            await follow.save();
            res.status(200).json(follow);
        } catch (err) {
            console.log("error following", err);
            res.status(500).json({error: err.message});
        }
    });
}

module.exports = {
    configureRelation,
};
