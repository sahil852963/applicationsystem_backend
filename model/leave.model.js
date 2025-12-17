import mongoose from "mongoose";

const leaveDaySchema = new mongoose.Schema(
	{
		date: {
			type: String, 
			required: true
		},

		leave_type: {
			type: String,
			enum: ["full_day", "half", "short", "restricted"],
			required: true
		},

		session: {
			type: String,
			enum: ["morning", "evening"],
			default: null
		}

	},
	{ _id: false }
);

const leaveSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			index: true
		},

		leave_mode: {
			type: String,
			enum: ["single", "multiple", "restricted"],
			required: true
		},

		leaves: {
			type: [leaveDaySchema],
			required: true,
			validate: [
				v => Array.isArray(v) && v.length > 0,
				"At least one leave day is required"
			]
		},

		reason: {
			type: String,
			required: true
		},

		status: {
			type: String,
			enum: ["pending", "approved", "rejected"],
			default: "pending"
		}
	},
	{ timestamps: true }
);

const Leave = mongoose.model("Leave", leaveSchema);
export default Leave;
