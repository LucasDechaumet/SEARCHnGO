"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const settingRoute_1 = __importDefault(require("./routes/settingRoute"));
const dataRoute_1 = __importDefault(require("./routes/dataRoute"));
const cors_1 = __importDefault(require("cors"));
const robot_1 = require("./robot/robot");
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/setting", settingRoute_1.default);
app.use("/data", dataRoute_1.default);
console.log("Je lance l'application 2");
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    (0, robot_1.getAllJobs)();
});
