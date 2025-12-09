import express from "express";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
import Leave from "../model/leave.model.js";
import { authMiddleware } from "./../middleware/auth.js";

const router = express.Router();

router.get("/test", async (req, res) => {
  res.send("Server is Running ok");
});

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exist = await User.findOne({ email });
    if (exist)
      return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashed });

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "User registered successfully",
      token,
      newUser: { id: newUser._id, email: newUser.email },
    });
    // res.status(201).json({ message: "User registered", user: newUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Send mail
router.post("/send", authMiddleware, async (req, res) => {
  try {
    const data = req.body;
    const result = await Leave.create(data);

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sahilsharma83999@gmail.com",
        pass: "fgfj upky enzo oehf",
      },
    });

    let type = "";

    if (data.leave_type === "half") {
      type = "Half Day";
    } else if (data.leave_type === "full_day") {
      type = "Full Day";
    } else if (data.leave_type === "short") {
      type = "Short Leave";
    } else {
      type = "Restricted";
    }
    
    // Email options
    const mailOptions = {
      from: `"Leave Application System" <no-reply@netmente.com>`,
      replyTo: data.email,
      to: "sahil.sharma.01@netmente.com",
      subject: `Leave Request: ${type}`,
      text: `
        Leave Request Details:

        Employee Email: ${data.email}
        Leave Type: ${data.leave_type}
        Start Date: ${data.start_date}
        End Date: ${data.end_date}
        Reason: ${data.reason}
    `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "Email sent successfully",
      result,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to submit leave", err });
  }
});

// fORGOT pASSWORD
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email does not exist" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    // Configure mail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sahilsharma83999@gmail.com",
        pass: "fgfj upky enzo oehf",
      },
    });

    const link = `process.env.FRONT_END_URL${token}`;

    await transporter.sendMail({
      to: user.email,
      subject: "Password Reset Request",
      text: `Click the link to reset your password: ${link}`,
    });

    res.json({ message: "Reset link sent to email" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Reset Password
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(400).json({ message: "Invalid Token" });

    // user.password = password;
    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(400).json({ message: "Token expired or invalid" });
  }
});

// Delete all users
router.delete("/delete-all", async (req, res) => {
  try {
    await User.deleteMany({});
    res.status(200).json({ message: "All users deleted successfully" });
  } catch (error) {
    console.error("Error deleting users:", error);
    res.status(500).json({ message: "Failed to delete users" });
  }
});

export default router;
