import express from "express";
import settingRouter from "./routes/settingRoute";
import dataRouter from "./routes/dataRoute";
import cors from "cors";
import { getAllJobs } from "./robot/robot";
import { get } from "http";

const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());

app.use("/setting", settingRouter);
app.use("/data", dataRouter);

setTimeout(() => {
  getAllJobs();
}, 10 * 1000);

async function isAwake() {
  try {
    const awake = await fetch("https://searchngo.onrender.com/awake");
    if (awake.status === 200) {
      getAllJobs();
      setTimeout(() => {
        isAwake();
      }, 56 * 60 * 60 * 1000);
    } else {
      setTimeout(() => {
        isAwake();
      }, 45 * 1000);
    }
  } catch (error) {
    console.error("Error during fetch:", error);
    setTimeout(() => {
      isAwake();
    }, 45 * 1000);
  }
}

setTimeout(() => {
  isAwake();
}, 10 * 1000);

app.get("/awake", (req, res) => {
  res.status(200).send("I am awake");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
