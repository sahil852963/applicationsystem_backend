import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

export const ResetPasswordController = async (req, res) => {
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
}