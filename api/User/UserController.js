const User = require('./UserSchema');

//GET get current user
const showCurrent = (req, res) => {
    User.findById(req.session.currentUser.id, {password: 0, __v: 0}, (err, foundUser) => {
        if (err) return res.status(500).json({status: 500, message: 'Something went wrong. Please try again'});

        res.status(200).json({status: 200, data: foundUser});
    });
};

//GET get user
const showUser = (req, res) => {
    User.findById(req.params.id, {password: 0, __v: 0}, (err, foundUser) => {
        if (err) return res.status(500).json({status: 500, message: 'Something went wrong. Please try again'});

        res.status(200).json({status: 200, data: foundUser});
    });
};

//GET search users
const searchUsers = async (req, res) => {
    const query = new RegExp('.*' + req.params.query + '.*');
    const users = await User.find({username: query}, {password: 0, __v: 0});

    res.json({users: users});
};

//POST update user
const update = async (req, res) => {
    try {
        //find the user
        const user = await User.findById(req.session.currentUser.id);

        const {errors, notValid} = validate(req.body);

        // Validate Form Data
        if (notValid) {
            return res.status(400).json({status: 400, errors});
        }

        //update user
        user.name = req.body.name;
        user.email = req.body.email;

        //check the updated image file
        if (req.body.avatar) {
            const fileName = path.basename(req.body.avatar);
            const fileExists = await fs.existsSync(`${__dirname}/../uploads/tmp/${fileName}`);
            if (fileExists) {
                //move image to the /uploads/posts folder
                await fs.renameSync(`${__dirname}/../uploads/tmp/${fileName}`, `${__dirname}/../uploads/users/${fileName}`);
                const imageDir = `uploads/users/${fileName}`;

                //delete previous avatar
                if (user.avatar !== 'uploads/default/user.png') {
                    fs.unlink(user.avatar, (err) => {
                        console.log(err);
                    });
                }


                user.avatar = imageDir;

            }
        }

        //save user
        try {
            const savedUser = await user.save();
            res.json({status: 200, message: 'success'});
        } catch (err) {
            console.log(err);
            res.status(500).json({status: 500, message: 'Interanal Server Error'});
        }

    } catch (err) {
        console.log(err);
        res.status(404).json({status: 404, message: 'User not found'})
    }
};

module.exports = {
    showCurrent,
    showUser,
    update,
    searchUsers
};
