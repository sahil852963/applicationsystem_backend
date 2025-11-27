import express from "express";
import connectDB from "./config/dbconfig.js";
import mongoose from "mongoose";
import Leave from "./model/leave.model.js";
import cors from "cors";
import nodemailer from "nodemailer";

const PORT = 3500;
const app = express();

connectDB();

app.use(express.json());
app.use(cors());

app.post("/", async (req, res) => {
  const data = req.body;
  // console.log("my data: ", data);

  try {
    // res.send('bjbjbjbj');
    // Save leave to MongoDB
    // const result = await Leave.create(data);

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
      message: "Leave submitted and email sent successfully",
      // result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to submit leave", error });
  }
});

mongoose.connection.once("open", () => {
  console.log("MongoDB Connected Successfully");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB Connection Error: ", err);
});
