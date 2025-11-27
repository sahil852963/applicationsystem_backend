import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    leave_type: { type: String, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    reason: { type: String, required: true },
  },
  { timestamps: true }
);

const Leave = mongoose.model("Leave", leaveSchema);

export default Leave;
