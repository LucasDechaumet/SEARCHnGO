import {
  getqParam,
  getLocation,
  getlrad,
  addCompagny,
  alreadyInDb,
  hasBanWord,
  getAdress,
} from "./utils";

const URL = "https://serpapi.com/search.json?";
const ENGINE = "google_jobs";
const HL = "fr";
const API_KEY = "76c2f42ae66022449bf1775238a929a80e0c634c7c0f5877f77ff35e02e923cd";

export async function getAllJobs() {
  const promises: Promise<void>[] = [];
  for (let index = 0; index <= 100; index += 10) {
    try {
      const q = await getqParam();
      const location = await getLocation();
      const lrad = await getlrad();

      let url = `${URL}engine=${ENGINE}&hl=${HL}&api_key=${API_KEY}&q=${q}&location=${location}&start=${index}`;
      if (lrad !== 0) {
        url += `&lrad=${lrad}`;
      }
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      const qParam = data.search_parameters.q;
      const jobList: JobResult[] = data.jobs_results;

      jobList.forEach(async (job) => {
        const alreadyDb = await alreadyInDb(job.company_name);
        const booleanHasBanWord = await hasBanWord(job);
        if (!alreadyDb && !booleanHasBanWord) {
          const result = await getAdress(job.company_name, job.location);
          const address = result.formatted_address;
          const coords = result.geometry.location;
          const newCompagny: Compagny = {
            q_parameter: qParam,
            compagny_name: job.company_name,
            title: job.title,
            location: job.location,
            address: address,
            coords: coords,
            met: false,
          };
          promises.push(addCompagny(newCompagny));
        }
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }
  await Promise.all(promises);
}
