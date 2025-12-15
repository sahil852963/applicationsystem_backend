import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    leave_type: { type: String, required: true },
    email: { type: String, required: true },
    time: { type: String },
    date: { type: [String], required: true },
    end_date: { type: Date },
    reason: { type: String, required: true },
  },
  { timestamps: true }
);

const Leave = mongoose.model("Leave", leaveSchema);

export default Leave;
