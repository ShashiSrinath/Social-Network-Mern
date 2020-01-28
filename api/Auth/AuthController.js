const bcrypt = require('bcrypt');
const User = require('../User/UserSchema');
const jwt = require('jsonwebtoken');
const registerValidation = require('./validation/registerValidation');

/*  @POST /auth/register
 *  ACCESS : public
 *  register an user */
const register = (req, res) => {
    const { errors, notValid } = registerValidation(req.body);

    // Validate Form Data
    if (notValid) {
        return res.status(400).json({ status: 400, errors });
    }

    // Verify Account Does Not Already Exist
    User.findOne({ email: req.body.email }, (err, foundUser) => {
        if (err) return res.status(500).json({ status: 500, message: 'Something went wrong. Please try again'});

        if (foundUser) return res.status(400).json({ status: 400, message: 'Email address has already been registered. Please try again' });

        // Generate Salt (Asynchronous callback version)
        bcrypt.genSalt(10, (err, salt) => {
            if (err) return res.status(500).json({ status: 500, message: 'Something went wrong. Please try again' });
            // if (err) throw err;

            // Hash User Password
            bcrypt.hash(req.body.password, salt, (err, hash) => {
                if (err) return res.status(500).json({ status: 500, message: 'Something went wrong. Please try again'});

                const newUser = {
                    username: req.body.username,
                    name: req.body.name,
                    email: req.body.email,
                    password: hash,
                };

                User.create(newUser, (err, savedUser) => {
                    if (err) {
                        if (err.code === 11000) return res.status(400).json({ status: 400, message: 'Username already exists. Please try another one'});
                        return res.status(500).json({ status: 500, message: err});
                    }
                    res.status(201).json({ status: 201, message: 'success' });
                });
            });
        });

    });
};

/*  @POST /auth/login
 *  ACCESS : public
 *  login  */
const login = (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ status: 400, message: 'Please enter your email and password' });
    }

    User.findOne({email: req.body.email}, (err, foundUser) => {
        if (err) return res.status(500).json({ status: 500, message: 'Something went wrong. Please try again' });

        if (!foundUser) {
            return res.status(400).json({ status: 400, message: 'Username or password is incorrect'});
        }

        bcrypt.compare(req.body.password, foundUser.password, (err, isMatch) => {
            if (err) return res.status(500).json({ status: 500, message: 'Something went wrong. Please try again' });

            if (isMatch) {
                const token = jwt.sign(
                    {
                        _id: foundUser._id,
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: 60 * 60,
                    }
                );
                return res.status(200).json({ status: 200, message: 'Success', token});
            } else {
                return res.status(400).json({ status: 400, message: 'Username or password is incorrect' });
            }

        });
    });
};

module.exports = {
    register,
    login
};