import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

export const UserRegisterController = async (req, res) => {
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
}