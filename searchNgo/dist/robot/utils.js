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
exports.getAdress = exports.hasBanWord = exports.getBanWords = exports.alreadyInDb = exports.addCompagny = exports.getlrad = exports.getLocation = exports.getqParam = void 0;
const prisma_1 = __importDefault(require("../prisma"));
function getqParam() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield prisma_1.default.qParameter.findFirst();
            const q = response === null || response === void 0 ? void 0 : response.param;
            return q;
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.getqParam = getqParam;
function getLocation() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield prisma_1.default.qParameter.findFirst();
            const location = response === null || response === void 0 ? void 0 : response.location;
            return location;
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.getLocation = getLocation;
function getlrad() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield prisma_1.default.qParameter.findFirst();
            const lrad = response === null || response === void 0 ? void 0 : response.lrad;
            return lrad;
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.getlrad = getlrad;
function addCompagny(compagny) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield prisma_1.default.compagnies.create({
                data: Object.assign({}, compagny),
            });
        }
        catch (error) {
            console.error("Error adding compagny:", error);
        }
    });
}
exports.addCompagny = addCompagny;
function alreadyInDb(name) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const findFirst = yield prisma_1.default.compagnies.findFirst({
                where: { compagny_name: name },
            });
            if (findFirst == null) {
                return false;
            }
        }
        catch (error) {
            console.error(error);
        }
        return true;
    });
}
exports.alreadyInDb = alreadyInDb;
function getBanWords() {
    return __awaiter(this, void 0, void 0, function* () {
        let listBanWords = [];
        try {
            const response = yield prisma_1.default.banWords.findMany({
                where: {},
            });
            response.forEach((banWord) => {
                listBanWords.push(banWord.word);
            });
            return listBanWords;
        }
        catch (error) {
            console.error(error);
            return [];
        }
    });
}
exports.getBanWords = getBanWords;
function hasBanWord(compagnies) {
    return __awaiter(this, void 0, void 0, function* () {
        const banWords = yield getBanWords();
        for (const banWord of banWords) {
            if (compagnies.title.toLowerCase() === banWord.toLowerCase() ||
                compagnies.company_name.toLowerCase() === banWord.toLowerCase()) {
                return true;
            }
        }
        return false;
    });
}
exports.hasBanWord = hasBanWord;
const API_KEY = process.env.API_KEY_GEOCODE;
const URL_GEOCODE = "https://maps.googleapis.com/maps/api/geocode/json?";
function getAdress(name, city) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${URL_GEOCODE}address=${encodeURIComponent(`${name} ${city}`)}&key=${API_KEY}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = yield response.json();
            return data.results[0];
        }
        catch (error) {
            console.error("Error:", error);
        }
    });
}
exports.getAdress = getAdress;
