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
const prisma_1 = __importDefault(require("../prisma"));
const router = express_1.default.Router();
router.get("/parameter", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield prisma_1.default.qParameter.findMany({
            where: {},
        });
        res.json(response);
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: "Une erreur est survenue lors du traitement de la demande." });
    }
}));
router.post("/chips", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        if (body.keyword === undefined ||
            body.location === undefined ||
            body.lrad === undefined) {
            throw new Error("Un ou plusieurs champs requis sont manquants.");
        }
        else {
            yield prisma_1.default.qParameter.updateMany({
                where: {},
                data: {
                    param: `${body.keyword}`,
                    location: `${body.location}`,
                    lrad: parseInt(body.lrad),
                },
            });
            res.send("Oui c'est bien la !");
        }
    }
    catch (error) {
        console.error("Error :", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
router.post("/banCompagnie", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const id = body.id;
        const compagny_name = body.compagny_name;
        yield prisma_1.default.compagnies.delete({
            where: {
                id: id,
            },
        });
        yield prisma_1.default.banWords.create({
            data: {
                word: compagny_name,
            },
        });
        res.send("Bien supp");
    }
    catch (error) {
        console.error("Error:", error);
    }
}));
router.post("/banTitle", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const id = body.id;
        const title = body.title;
        yield prisma_1.default.compagnies.delete({
            where: {
                id: id,
            },
        });
        yield prisma_1.default.banWords.create({
            data: {
                word: title,
            },
        });
        res.send("Bien supp");
    }
    catch (error) {
        console.error("Error:", error);
    }
}));
router.post("/banWords", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        body.forEach((banWord) => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma_1.default.banWords.create({
                data: {
                    word: banWord,
                },
            });
        }));
        res.send("bien ajoutée");
    }
    catch (error) {
        console.error("Error:", error);
    }
}));
router.post("/password", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const password = body.password;
        const prismaPassword = yield prisma_1.default.password.findFirst({
            where: {
                password: password,
            },
        });
        if (prismaPassword === null) {
            res.json({ success: false, message: "Mot de passe incorrect" });
        }
        else {
            res.json({ success: true, message: "Mot de passe correct" });
        }
    }
    catch (error) {
        console.error("Error:", error);
    }
}));
exports.default = router;
