function configureProfileDB(app, Profile) {

    app.post('/profile', async (req, res) => {
        console.log('Request body: post profile ', req.body)
        const {handle, bio, dob, location, followers, following, wallpaperUrl, tweets} = req.body;

        try {
            console.log('Posting profile:', handle, bio, dob, location, followers, following, wallpaperUrl, tweets)
            const newProfileData = new Profile({
                handle,
                bio,
                dob,
                location,
                followers,
                following,
                wallpaperUrl,
                tweets
            });
            await newProfileData.save();
            res.json({success: true});
        } catch (error) {
            console.error('Error posting profile:', error);
            res.status(500).json({success: false, error: 'Server error'});
        }
    });

    app.get('/profile/:handle', async (req, res) => {
        const {handle} = req.params;
        console.log('Request body: get profile ', req.body)
        try {
            const profile = await Profile.findOne({handle});

            if (!profile) {
                return res.status(404).json({error: 'Profile not found'});
            }

            const profileData = {
                handle: profile.handle,
                bio: profile.bio,
                dob: profile.dob,
                location: profile.location,
                followers: profile.followers,
                following: profile.following,
                wallpaperUrl: profile.wallpaperUrl,
                tweets: profile.tweets,
            }

            res.status(200).json(profileData);
        } catch (error) {
            console.error('Error fetching Profile:', error);
            res.status(500).json({error: 'Server error'});
        }
    });
}

module.exports = {
    configureProfileDB,
}
