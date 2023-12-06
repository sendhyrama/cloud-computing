//importing modules
const express = require("express");
const db = require("../models");
const jwt = require("jsonwebtoken");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
//Assigning db.users to User variable
const User = db.users;
const dotenv = require("dotenv")

dotenv.config()

//Konfigurasi Passport
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            callbackURL: "http://localhost:5000/auth/google/callback",
            passReqToCallback: true,
        },
        function (request, accessToken, refreshToken, profile, done) {
            return done(null, profile);
        }
    )
)

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

const saveUser = async (req, res, next) => {
    //search the database to see if user exist
    try {
        const username = await User.findOne({
            where: {
                userName: req.body.userName,
            },
        });
        //if username exist in the database respond with a status of 409
        if (username) {
            return res.json(409).send("username already taken");
        }

        //checking if email already exist
        const emailcheck = await User.findOne({
            where: {
                email: req.body.email,
            },
        });

        //if email exist in the database respond with a status of 409
        if (emailcheck) {
            return res.json(409).send("Authentication failed");
        }

        next();
    } catch (error) {
        console.log(error);
    }
};

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus (401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403);
        req.email = decoded.email;
        next();
    })
};

//exporting module
module.exports = {
    saveUser,
    verifyToken
};
