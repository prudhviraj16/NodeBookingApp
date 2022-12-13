import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res, next) => {
  try {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
    });
    await newUser.save();

    res.status(200).json("User has been created");
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const userDb = await User.findOne({ email: req.body.email });
    if (!userDb) {
      return res.send({
        status: 404,
        message: "User not found",
      });
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      userDb.password
    );
    if (!validPassword) {
      return res.send({
        status: 400,
        message: "Wrong Password",
      });
    }

    const token = jwt.sign(
      { id: userDb._id, isAdmin: userDb.isAdmin },
      "token"
    );

    const { password, isAdmin, ...otherDetails } = userDb._doc;
    res
      .cookie("accesstoken", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ ...otherDetails });
  } catch (err) {
    next(err);
  }
};
