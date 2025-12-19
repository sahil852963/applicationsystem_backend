import Leave from "../model/leave.model.js";

export const DataDeleteController = async (req, res) => {
	try {
		await Leave.deleteMany({});
		res.status(200).json({ message: "All leaves deleted successfully" });
	} catch (error) {
		console.error("Error deleting leaves:", error);
		res.status(500).json({ message: "Failed to delete leaves" });
	}
}