// controllers for users
import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "./emailSender.js";
//  * normal user registration to the dashboard
// traditional way of registering a user
const handleNormalUserRegistration = async (req, res) => {
  const { email, password } = req.body;
  try {
    // check if user with email exists
    const user = await User.findUserByEmail(email);
    // something is returned, then such user exists
    if (user) {
      return res.status(400).json({ message: "User already exists!" });
    }
    // hash the password
    const hashedPass = await bcrypt.hash(password, 10);
    const createUser = await User.createUserWithEmail(email, hashedPass);
    if (!createUser) {
      return res
        .status(400)
        .json({ message: "An error occurred while creating account" });
    }
    // send email to user to verify email
    // jwt payload
    
   const payload = {
      user_id: createUser.insertId,
      email: email,
   }
    // create token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    // send email
    const link = `${process.env.CLIENT_URL}/api/v1/verify?token=${token}`;
    console.log(link);
    const content = `<h1>Verify your email</h1>
    <p>Click the link below to verify your email</p>
    <a href="${link}">Verify Email</a>`;
    const subject = "Verify your email";
    const send = await sendEmail.sendEmail(content, subject, email);
    return res.status(200).json({ message: "User registered successfully, now verify email" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

// * verify email address
const verifyEmail = async (req, res, email) => {
  try {
    // check if user with email exists
    const user = await User.findUserByEmail(email);
    // something is returned, then such user exists
    if (!user) {
      return res.status(400).json({ message: "No such user!" });
    }
    // jwt payload
    const payload = {
      user_id: user.user_id,
      email: user.email,
    };
    // create token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    // send email
    const link = `${process.env.CLIENT_URL}/api/v1/verify?token=${token}`;
    console.log(link);
    const content = `<h1>Verify your email</h1>
    <p>Click the link below to verify your email</p>
    <a href="${link}">Verify Email</a>`;
    const subject = "Verify your email";
    const send = await sendEmail.sendEmail(content, subject, email);
    if (send) {
      return res.status(200).json({ message: "Email sent successfully" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

// google user registration to the dashboard

// * user login wth email/password

// * success login route
const successLogin = (req, res) => {
  res.status(200).json({ message: "Login successful" });
};

// * failure login route
const failureLogin = (req, res) => {
  res.status(400).json({ message: "Login failed" });
};

export default {
  handleNormalUserRegistration,
  successLogin,
  failureLogin,
  verifyEmail,
};
