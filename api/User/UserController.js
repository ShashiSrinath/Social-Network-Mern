const User = require('./UserSchema');
const userUpdateValidation = require('./validations/userUpdateValidation');

//GET get current user
const showCurrent = (req, res) => {
    User.findById(req.user._id, {password: 0, __v: 0}, (err, foundUser) => {
        if (err) return res.status(500).json({status: 500, message: 'Something went wrong. Please try again'});

        res.status(200).json({status: 200, user: foundUser});
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
        const user = await User.findById(req.user._id);

        const {errors, notValid} = userUpdateValidation(req.body);

        // Validate Form Data
        if (notValid) {
            return res.status(400).json({status: 400, errors});
        }

        //update user
        user.name = req.body.name;
        user.email = req.body.email;
        console.log(req.body);
        //check the updated image file
        if (req.body.avatar) {
            user.avatar = req.body.avatar;
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
