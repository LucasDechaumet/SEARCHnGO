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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllJobs = void 0;
const utils_1 = require("./utils");
const URL = "https://serpapi.com/search.json?";
const ENGINE = "google_jobs";
const HL = "fr";
const API_KEY = "76c2f42ae66022449bf1775238a929a80e0c634c7c0f5877f77ff35e02e923cd";
function getAllJobs() {
    return __awaiter(this, void 0, void 0, function* () {
        const promises = [];
        for (let index = 0; index <= 100; index += 10) {
            try {
                const q = yield (0, utils_1.getqParam)();
                const location = yield (0, utils_1.getLocation)();
                const lrad = yield (0, utils_1.getlrad)();
                let url = `${URL}engine=${ENGINE}&hl=${HL}&api_key=${API_KEY}&q=${q}&location=${location}&start=${index}`;
                if (lrad !== 0) {
                    url += `&lrad=${lrad}`;
                }
                const response = yield fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = yield response.json();
                const qParam = data.search_parameters.q;
                const jobList = data.jobs_results;
                jobList.forEach((job) => __awaiter(this, void 0, void 0, function* () {
                    const alreadyDb = yield (0, utils_1.alreadyInDb)(job.company_name);
                    const booleanHasBanWord = yield (0, utils_1.hasBanWord)(job);
                    if (!alreadyDb && !booleanHasBanWord) {
                        const result = yield (0, utils_1.getAdress)(job.company_name, job.location);
                        const address = result.formatted_address;
                        const coords = result.geometry.location;
                        const newCompagny = {
                            q_parameter: qParam,
                            compagny_name: job.company_name,
                            title: job.title,
                            location: job.location,
                            address: address,
                            coords: coords,
                            met: false,
                        };
                        promises.push((0, utils_1.addCompagny)(newCompagny));
                    }
                }));
            }
            catch (error) {
                console.error("Error:", error);
            }
        }
        yield Promise.all(promises);
    });
}
exports.getAllJobs = getAllJobs;
