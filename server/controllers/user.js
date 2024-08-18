const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const User = require("../models/user");
const HttpError = require("../models/error");
const { v4: uuid } = require("uuid");

// REGISTER A NEW USER
// POST: http://localhost:5000/api/users/register
// UNPROTECTED
const register = async (req, res, next) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        if (!name || !email || !password) return next(new HttpError("Fill in all the fields!", 422));

        const newEmail = email.toLowerCase();
        const emailExists = await User.findOne({ email: newEmail });

        if (emailExists) return next(new HttpError("Email already exists!", 422));
        if ((password.trim()).length < 6) return next(new HttpError("Password should be atleast 6 characters long!", 422));
        if (password != confirmPassword) return next(new HttpError("Password do not match!", 422));
        
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({ name, email: newEmail, password: hashPassword });

        res.status(201).json(`New User - ${newUser.email} registered.`);
    } catch (error) {
        return next(new HttpError("User Registration Failed!", 422));
    }
};

// LOGIN AN EXISTING USER
// POST: http://localhost:5000/api/users/login
// UNPROTECTED
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return next(new HttpError("Fill in all fields!", 422));

        const newEmail = email.toLowerCase();
        const user = await User.findOne({ email: newEmail });

        if (!user) return next(new HttpError("Invalid Credentials!", 422));

        const comparePassword = await bcrypt.compare(password, user.password);

        if (!comparePassword) return next(new HttpError("Invalid Credentials!", 422));

        const { _id: id, name } = user;
        const token = jwt.sign({ id, name }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({ token, id, name });
    } catch (error) {
        return next(new HttpError("Login Failed, Please check your credentials!", 422));
    }
};

// USER PROFILE
// GET: http://localhost:5000/api/users/:id
// PROTECTED
const profile = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select("-password");

        if (!user) return next(new HttpError("User not found!", 404));

        res.status(200).json(user);
    } catch (error) {
        return next(new HttpError(error));
    }
};

// CHANGE USER AVATAR (PROFILE PICTURE)
// POST: http://localhost:5000/api/users/change-avatar
// PROTECTED
const avatar = async (req, res, next) => {
    try {
        if (!req.files.avatar) return next(new HttpError("Please choose an image!", 422));

        // find user from database
        const user = await User.findById(req.user.id);
        // delete old avatar if exists
        if (user.avatar) {
            fs.unlink(path.join(__dirname, "..", "/uploads/users", user.avatar), (error) => {
                if (error) return next(new HttpError(error));
            });
        }

        const { avatar } = req.files;
        // check file size
        if (avatar.size > 500000) return next(new HttpError("Profile picture should be less than 500KB.", 422));

        let fileName = avatar.name.split(".")[0] + uuid() + "." + avatar.name.split(".").pop();
        avatar.mv(path.join(__dirname, "..", "/uploads/users", fileName), async (error) => {
            if (error) return next(new HttpError(error));

            const updatedAvatar = await User.findByIdAndUpdate(req.user.id, { avatar: fileName }, { new: true });

            if (!updatedAvatar) return next(new HttpError("Failed to change avatar!", 422));

            res.status(200).json(updatedAvatar);
        });
    } catch (error) {
        return next(new HttpError(error));
    }
};

// EDIT USER DETAILS (PROFILE)
// PATCH: http://localhost:5000/api/users/edit-user
// PROTECTED
const edit = async (req, res, next) => {
    try {
        const { name, email, currentPassword, newPassword, confirmNewPassword } = req.body;

        if (!name || !email || !currentPassword || !newPassword || !confirmNewPassword)
            return next(new HttpError("Fill in all fields!", 422));

        // get user from database
        const user = await User.findById(req.user.id);

        if (!user) return next(new HttpError("User not found!", 403));

        // make sure new email doesn't alredy exists
        const emailExists = await User.findOne({ email });

        if (emailExists && (emailExists._id.toString() !== req.user.id))
            return next(new HttpError("Email already exist!", 422));

        // compare current password to database password
        const validatePassword = await bcrypt.compare(currentPassword, user.password);

        if (!validatePassword) return next(new HttpError("Invalid password", 422));
        // compare new password
        if (newPassword !== confirmNewPassword) return next(new HttpError("Passwords do not match!", 422));

        // hash new password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(newPassword, salt);

        // update user information in database
        const userInfo = await User.findByIdAndUpdate(req.user.id, { name, email, password: hashPassword }, { new: true });

        res.status(200).json(userInfo);
    } catch (error) {
        return next(new HttpError(error));
    }
};

// GET USERS
// GET: http://localhost:5000/api/users
// UNPROTECTED
const authors = async (req, res, next) => {
    try {
        const authors = await User.find().select("-password");
        res.json(authors);
    } catch (error) {
        return next(new HttpError(error));
    }
};

module.exports = { register, login, profile, avatar, edit, authors };