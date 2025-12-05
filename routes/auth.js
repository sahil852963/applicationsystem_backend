import express from "express";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
import Leave from "../model/leave.model.js";
import { authMiddleware } from "./../middleware/auth.js";

const router = express.Router();

router.get('/test', async (req, res) => {
    res.send('Server is Running ok');
})

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

    // Email options
    const mailOptions = {
      from: "ragbrok194@gmail.com",
      to: "sahil.sharma.01@netmente.com",
      subject: `Leave Request: ${data.leave_type}`,
      text: `
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
    res.status(500).json({ message: "Failed to submit leave", error });
  }
});

export default router;
