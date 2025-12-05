import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import AuthRoutes from "./routes/auth.js";
import connectDB from "./config/dbconfig.js";

const PORT = 3500;
const app = express();

connectDB();

app.use(express.json());
app.use(cors());

app.use("/api", AuthRoutes);

mongoose.connection.once("open", () => {
  console.log("MongoDB Connected Successfully");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB Connection Error: ", err);
});
