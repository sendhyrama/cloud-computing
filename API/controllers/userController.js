//importing modules
const bcrypt = require("bcrypt");
const db = require("../models");
const jwt = require("jsonwebtoken");
const { validationResult } = require('express-validator')
const passport = require("passport");
const user = require("../models/user");
const nodemailer = require("nodemailer");

// Assigning users to the variable User
const user = db.users;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL, // Ganti dengan email pengirim
        pass: process.env.PASSWORD, // Ganti dengan password email pengirim
    },
});

const getUsers = async(req, res) => {
    try {
        const User = await user.findAll();
        return res.status(200).json({status: 'Success', message: 'Data retrieved successfully!', data:  user });
    } catch (e) {
        console.log(e);
    }
}

const getUserById = async (req, res) => {
    const id = parseInt(req.params.id)
    try {
        await user.findByPk(id).then(user => {
            if (user) {
                return res.status(200).json({status: 'Success', message: 'Data retrieved successfully!', data: user.toJSON() });
             } else {
                console.log('User not found');
                return res.status(404).json({ error: 'User not found' });
            }
        }).catch(error => {
            console.error('Error:', error);
        });
    } catch (e) {
        res.status(400).json(e)
    }
}

const Register = async (req, res) => {
    const { fullname, email, password, confPassword } = req.body;
    if (password !== confPassword) {
      return res.status(400).json({ msg: "Password and password confirmation do not match" });
    }

    try {
        // Check if the email already exists in the database
        const existingUser = await userser.findOne({ where: { user_email: email } });
        if (existingUser) {
        return res.status(400).json({ msg: "Email already exists" });
      }
      
      const otp = Math.random().toString().slice(-5);
      const expirationTime = new Date(Date.now() + 5 * 60 * 1000);
      
      const mailOptions = {
          from: process.env.MAIL_USERNAME,
          to: email,
          subject: 'Verification Code',
          text: `Your verification code is: ${otp}\n\nNote: please enter the OTP code immediately as it will expire within 5 minutes.`,
        };

//baru sampe sini
      await transporter.sendMail(mailOptions);
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);

      if (fullname !== "" && email !== "" && hashPassword !== "") {
        const User = await user.create({
          fullname_user: fullname,
          email_user: email,
          password_user: hashPassword,
          otp: otp
        });


        res.status(201).json({ status: 'Success', message: 'Your account has been created!, Please check your email for the verification code', data: user.toJSON() });
      } else {
        return res.status(400).json({ msg: "Form cannot be null" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Server error" });
    }
  };

const verifyOTP = async (req, res) => {
    try {
        const { otp } = req.body;
        // Find the user with the provided email
        const User = await user.findOne({ where: { otp: otp } });

        if (!user) {
            return res.status(404).json({
                error: 'OTP invalid',
            });
        }

        // Verify the OTP
        if (user.otp === otp) {
            // Update the user's otpVerified status
            user.otpVerified = true;
            await user.save();

            return res.status(200).json({
                message: 'OTP verified successfully. You can now access your account.',
            });
        }

        return res.status(400).json({
            error: 'Invalid OTP.',
        });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({
            error: 'An error occurred while verifying OTP.',
        });
    }
}


const Login = async(req, res) => {
    try {
        const user = await User.findAll({
            where:{
                email_user: req.body.email
            }
        });
        const match = await bcrypt.compare(req.body.password, user[0].password_user);
        if(!match) return res.status(400).json({msg: "Password invalid"});
        const userId = user[0].user_id;
        const username = user[0].user_username;
        const email = user[0].user_email;
        const accessToken = jwt.sign({userId, username, email}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '180s'
        });
        const refreshToken = jwt.sign({userId, username, email}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: '1d'
        });
        await User.update({refresh_token: refreshToken},{
            where:{
                user_id: userId
            }
        });
        res.cookie('refreshToken', refreshToken,{
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.status(200).json({ status: 'Success', message: 'Login successful!', data: { accessToken } });

    } catch (error) {
        res.status(404).json({msg:"Email invalid"});
    }
}

const Logout = async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) return res.json({ message: 'refresh token not found' });

      const user = await User.findOne({
        where: {
          refresh_token: refreshToken,
        },
      });
      if (!user) return res.json({ message: 'user not found' });

      const id = user.user_id;
      await User.update(
        { refresh_token: null },
        {
          where: {
            user_id: id,
          },
        }
      );
      req.session.destroy();
      res.clearCookie('refresh_token');
      return res.status(200).json({ message: 'Logout success!' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Failed to logout' });
    }
  };


const refreshToken = async(req, res) => {
    try {
        const refreshToken = req.cookies.refresh_token;
        if(!refreshToken) return res.sendStatus(401);
        const user = await User.findAll({
            where:{
                refresh_token: refreshToken
            }
        });
        if(!user[0]) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if(err) return res.sendStatus(403);
            const userId = user[0].user_id;
            const username = user[0].user_username;
            const email = user[0].user_email;
            const accessToken = jwt.sign({userId, username, email}, process.env.ACCESS_TOKEN_SECRET,{
                expiresIn: '180s'
            });
            res.json({ accessToken });
        });
    } catch (error) {
        console.log(error);
    }
}

const callbackGoogle = async (req, res) => {
    try {
       await passport.authenticate( 'google', {
            successRedirect: '/protected',
            failureRedirect: '/auth/google/failure'
        })
    } catch (e) {
        console.log(e);
    }
}

const authGoogle = async (req, res) => {
    try {
       await passport.authenticate('google', { scope: [ 'email', 'profile' ] })
    } catch (e) {
        console.log(e)
    }
}

const protected = async (req, res) => {
    try {
        res.send(`Hello ${req.user.displayName}`);
    } catch (e) {
        console.log(e)
    }
}

const failed = async (req, res) => {
    try {
        res.send('Failed to authenticate..');
    } catch (e) {
        console.log(e)
    }
}

  const updateUser = async (req, res) => {
    const id = parseInt(req.params.id);
    const { username, fullname, address, phone, photo } = req.body;
    try {
      const user = await User.findByPk(id);
      if (user) {
        const updatedUser = await user.update({
            user_username: username,
            user_fullname: fullname,
            user_address: address,
            user_phoneNumber: phone,
            user_profile: photo,
        });
        return res.status(200).json({ status: 'Success', message: 'User profile updated successfully!', data: updatedUser.toJSON() });
      } else {
        return res.status(404).json({ message: 'user not found' });
      }
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  const deleteUserById = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const user = await User.findByPk(id);
        if (user) {
            await User.delete({
                where: {
                    user_id: id
                }
            });
            return res.status(200).json({ status: 'Success', message: 'User deleted successfully!', data: user.toJSON() });
        } else {
            console.log('User not found');
            return res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getUsers,
    getUserById,
    Register,
    Login,
    Logout,
    refreshToken,
    updateUser,
    deleteUserById,
    failed,
    protected,
    authGoogle,
    callbackGoogle,
    verifyOTP
};