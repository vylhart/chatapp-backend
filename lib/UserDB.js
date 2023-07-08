const bcrypt = require('bcrypt');
const { getToken } = require('./middleware');

function configureUserDB(app, Credential, User) {

    app.post('/login', async (req, res) => {
        console.log('Request body: sign in ', req.body)
        const { handle, password } = req.body;

        try {
            const user = await Credential.findOne({ handle });

            if (!user) {
                return res.status(401).json({ error: 'No such username' });
            }
            console.log('Logging in:', handle, password)
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            const token = getToken(user._id);
            res.status(200).json({ token: token });
        } catch (error) {
            console.error('Error logging in:', error);
            res.status(500).json({ error: 'Server error' });
        }
    });


    app.post('/signup', async (req, res) => {
        console.log('Request body: sign up ', req.body)
        const {handle, password} = req.body;

        try {
            const existingUser = await Credential.findOne({handle});
            if (existingUser) {
                return res.json({success: false, error: 'Username already exists'});
            }
            console.log('Signing up:', handle, password)

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new Credential({handle, password: hashedPassword,});
            await newUser.save();
            res.json({success: true});

        } catch (error) {
            console.error('Error signing up:', error);
            res.status(500).json({success: false, error: 'Server error'});
        }
    });

    app.post('/user', async (req, res) => {
        console.log('Request body: post user ', req.body)
        const {handle, name, joined, _id, } = req.body;

        try {
            console.log('Posting user:', handle, name, joined, _id)
            const newUserData = new User({_id, handle, name, joined});
            await newUserData.save();
            res.json({success: true});
        } catch (error) {
            console.error('Error posting user:', error);
            res.status(500).json({success: false, error: 'Server error'});
        }
    });

    app.put('/user', async (req, res) => {
        console.log('Request body: post user', req.body);
        const { handle, name, joined, bio, location, imageUrl, wallpaperUrl, dob } = req.body;

        try {
            const updatedUser = await User.findOneAndUpdate(
                { handle }, // Query to find the user based on the handle
                { name, joined, bio, location, imageUrl, wallpaperUrl, dob }, // Updated data for the user
                { new: true } // To return the updated user instead of the original user
            );

            res.json({ success: true, user: updatedUser });
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ success: false, error: 'Server error' });
        }
    });


    app.get('/user/:handle', async (req, res) => {
        const { handle } = req.params;

        try {
            const user = await User.findOne({ handle });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const userData = {
                _id: user._id,
                handle: user.handle,
                imageUrl: user.imageUrl,
                name: user.name,
                joined: user.joined,
                bio: user.bio,
                location: user.location,
                wallpaperUrl: user.wallpaperUrl,
                dob: user.dob,
            };

            res.status(200).json(userData);
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ error: 'Server error' });
        }
    });
}

module.exports = {
    configureUserDB,
}
