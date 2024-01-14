import express from "express";
import settingRouter from "./routes/settingRoute";
import dataRouter from "./routes/dataRoute";
import cors from "cors";
import { getAllJobs } from "./robot/robot";

const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());

app.use("/setting", settingRouter);
app.use("/data", dataRouter);

getAllJobs();
console.log("Je lance l'application 2");

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
