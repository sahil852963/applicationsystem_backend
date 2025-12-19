import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) return res.status(401).json({ message: "Unauthorized no token" });

	try {
		const verified = jwt.verify(token, process.env.JWT_SECRET);
		req.user = verified;
		next();
	} catch {
		return res.status(401).json({ message: "Token invalid" });
	}
}
