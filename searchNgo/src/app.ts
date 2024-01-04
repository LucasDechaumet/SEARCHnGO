import express from "express";
import settingRouter from "./routes/settingRoute";
import dataRouter from "./routes/dataRoute";
import cors from "cors";
import { getAllJobs } from "./robot/robot";
import prisma from "./prisma";

const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());

// getAllJobs();

app.use("/setting", settingRouter);
app.use("/data", dataRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
