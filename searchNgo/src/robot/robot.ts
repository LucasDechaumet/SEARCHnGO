import {
  getqParam,
  getLocation,
  getlrad,
  addCompagny,
  alreadyInDb,
  hasBanWord,
  getAdress,
  getLastUpdate,
  setDateUpdate,
} from "./utils";

const URL = "https://serpapi.com/search.json?";
const ENGINE = "google_jobs";
const HL = "fr";
const API_KEY = process.env.API_KEY_GOOGLE;

export async function getAllJobs() {
  const currentDate = new Date();
  const lastUpdate = await getLastUpdate();
  let diffTime = 0;
  diffTime = (lastUpdate?.getTime() ?? 0) - currentDate.getTime();
  if (diffTime < -1.728e8) {
    console.log("Je lance le robot");
    setDateUpdate();

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
}
