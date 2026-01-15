const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please enter all the fields" });
    }

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashPassword,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Directly return the user including password
    return res.status(201).json({
      message: "User created successfully",
      user,  // 👈 full user object
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const logIn = async (req, res) => {
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                message: "Please fill all fields"
            })
        }
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                message: "user does not exist"
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(401).json({
                message: "Incorrect Password"
            })
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(200).json({
            message: "User logged in successfully",
            user
        });
        
    }
    catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

module.exports = { signUp, logIn };
