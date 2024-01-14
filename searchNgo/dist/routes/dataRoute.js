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
const utils_1 = require("../robot/utils");
const router = express_1.default.Router();
router.put("/changeAdress/:name", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const compagny_name = req.params.name;
        const response = yield prisma_1.default.compagnies.update({
            where: {
                compagny_name: compagny_name,
            },
            data: {
                address: body.adress,
            },
        });
        res.json(response);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
router.get("/allCompagnies/:keyword", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const keyword = req.params.keyword;
        if (keyword === undefined) {
            throw new Error("Keyword manquant");
        }
        const response = yield prisma_1.default.compagnies.findMany({
            where: {
                q_parameter: keyword,
            },
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
router.put("/importantCompagny/:name", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const compagny_name = req.params.name;
        const response = yield prisma_1.default.compagnies.update({
            where: {
                compagny_name: compagny_name,
            },
            data: {
                important: true,
            },
        });
        console.log(response);
        res.json(response);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
router.put("/removeImportantCompagny/:name", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const compagny_name = req.params.name;
        const response = yield prisma_1.default.compagnies.update({
            where: {
                compagny_name: compagny_name,
            },
            data: {
                important: false,
            },
        });
        res.json(response);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
router.put("/metCompagny/:name", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const compagny_name = req.params.name;
        const response = yield prisma_1.default.compagnies.update({
            where: {
                compagny_name: compagny_name,
            },
            data: {
                met: true,
            },
        });
        res.json(response);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
router.post("/addCompagny", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const boolean = yield (0, utils_1.alreadyInDb)(body.compagny_name);
    if (!boolean) {
        try {
            const response = yield (0, utils_1.getAdress)(body.compagny_name, body.location);
            const address = response.formatted_address;
            const coords = response.geometry.location;
            const compagny = {
                compagny_name: body.compagny_name,
                q_parameter: body.q_parameter,
                title: "Ajouté manuellement",
                location: body.location,
                address: address,
                coords: coords,
                met: false,
                important: false,
            };
            yield (0, utils_1.addCompagny)(compagny);
            res.send("bien ajoutée");
        }
        catch (error) {
            console.error(error);
        }
    }
    else {
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
exports.default = router;
