import express from "express";
import { authMiddleware } from "./../middleware/auth.js";
import { SendEmailController, UserRegisterController, UserLoginController, ForgotPasswordController, ResetPasswordController, DataDeleteController } from "../controller/index.js";

const router = express.Router();

router.get("/test", async (req, res) => {
	res.send("Server is Running ok");
});

// REGISTER
router.post("/register", UserRegisterController);

// LOGIN
router.post("/login", UserLoginController);

// Send Leave Route
router.post("/send", authMiddleware, SendEmailController);

// fORGOT pASSWORD
router.post("/forgot-password", ForgotPasswordController);

// Reset Password
router.post("/reset-password/:token", ResetPasswordController);

// Delete all leaves
router.delete("/delete-all-leaves", DataDeleteController);


// Delete all users
// router.delete("/delete-all", async (req, res) => {
// 	try {
// 		await User.deleteMany({});
// 		res.status(200).json({ message: "All users deleted successfully" });
// 	} catch (error) {
// 		console.error("Error deleting users:", error);
// 		res.status(500).json({ message: "Failed to delete users" });
// 		}
// });

export default router;
