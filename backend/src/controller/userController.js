import httpStatus from "http-status";
import { User } from "../models/user.models.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { Meeting } from "../models/meeting.model.js";

// -------------------- LOGIN --------------------
const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Please provide both username and password." });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "User not found." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid username or password." });
    }

    const token = crypto.randomBytes(20).toString("hex");
    user.token = token;
    await user.save();

    return res.status(httpStatus.OK).json({ token });
  } catch (e) {
    console.error("Login error:", e);
    return res.status(500).json({ message: "Something went wrong. Please try again later." });
  }
};

// -------------------- REGISTER --------------------
const register = async (req, res) => {
  console.log(req.body);
    const { name, username, password } = req.body;
    if (!name || !username || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(httpStatus.FOUND).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: name,
            username: username,
            password: hashedPassword
        });

        await newUser.save();

        res.status(httpStatus.CREATED).json({ message: "User Registered" })

    } catch (e) {
        res.json({ message: `Something went wrong ${e}` })
    }

}

// -------------------- GET USER HISTORY --------------------
const getUserHistory = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({ message: "Token missing or malformed." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid token." });
    }
    console.log("Stored token:", token);

    const meetings = await Meeting.find({ user_id: user.username });

    return res.status(httpStatus.OK).json({ history: meetings });
  } catch (e) {
    console.error("Get history error:", e);
    return res.status(500).json({ message: "Something went wrong. Please try again later." });
  }
};

// -------------------- ADD TO HISTORY --------------------
const addToHistory = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({ message: "Token missing or malformed." });
  }

  const token = authHeader.split(" ")[1]; // extract actual token
  const { meetingCode } = req.body;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(401).json({ message: "Invalid token." });
    }

    const newMeeting = new Meeting({
      user_id: user.username,
      meetingCode,
    });

    await newMeeting.save();

    res.status(201).json({ message: "Added code to history" });
  } catch (e) {
    console.error("Add to history error:", e);
    res.status(500).json({ message: `Something went wrong ${e}` });
  }
};



export { login, register, getUserHistory, addToHistory };
