import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../model/user.model.js";

export const ForgotPasswordController = async (req, res) => {
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
            to: "ragbrok194@gmail.com",
            // to: user.email,
            subject: "Password Reset Request",
            text: `Click the link to reset your password: ${link}`,
        });

        res.json({ message: "Reset link sent to email" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}