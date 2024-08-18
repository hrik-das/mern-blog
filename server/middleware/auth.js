const jwt = require("jsonwebtoken");

const HttpError = require("../models/error");

const auth = async (req, res, next) => {
    const authorization = req.headers.Authorization || req.headers.authorization;
    
    if (authorization && authorization.startsWith("Bearer")) {
        const token = authorization.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (error, info) => {
            if (error) return next(new HttpError("Unauthorized, Invalid token", 403));

            req.user = info;
            next();
        });
    } else {
        return next(new HttpError("Unauthorized, No token", 402));
    }
};

module.exports = auth;