"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const settingRoute_1 = __importDefault(require("./routes/settingRoute"));
const dataRoute_1 = __importDefault(require("./routes/dataRoute"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/setting", settingRoute_1.default);
app.use("/data", dataRoute_1.default);
setTimeout(() => {
    console.log("1getalljob()");
}, 10 * 1000);
function isAwake() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const awake = yield fetch("http://localhost:3000/awake");
            console.log("awake.status: " + awake.status);
            if (awake.status === 200) {
                console.log("2getalljob()");
                console.log("rebelote");
                setTimeout(() => {
                    isAwake();
                }, 5 * 1000);
            }
            else {
                console.log("else donc on isawake()");
                setTimeout(() => {
                    isAwake();
                }, 5 * 1000);
            }
        }
        catch (error) {
            console.error("Error during fetch:", error);
            setTimeout(() => {
                isAwake();
            }, 5 * 1000);
        }
    });
}
setTimeout(() => {
    isAwake();
}, 10 * 1000);
app.get("/awake", (req, res) => {
    res.status(500).send("I am awake");
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
