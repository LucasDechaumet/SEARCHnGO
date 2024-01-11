import express from "express";
import settingRouter from "./routes/settingRoute";
import dataRouter from "./routes/dataRoute";
import cors from "cors";
import { getAllJobs } from "./robot/robot";

const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());

// function runJobPeriodically() {
//   getAllJobs();
//   setTimeout(runJobPeriodically, 56 * 60 * 60 * 1000);
// }

// runJobPeriodically();

app.use("/setting", settingRouter);
app.use("/data", dataRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
