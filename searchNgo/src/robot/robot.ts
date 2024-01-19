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
  setTryDate,
} from "./utils";

const URL = "https://serpapi.com/search.json?";
const ENGINE = "google_jobs";
const HL = "fr";
const API_KEY = process.env.API_KEY_SERPAPI;

export async function getAllJobs() {
  const currentDate = new Date();
  const lastUpdate = await getLastUpdate();
  const diffTime = Number(currentDate) - Number(lastUpdate);
  if (diffTime > Number(process.env.TIME_BETWEEN_CALL)) {
    console.log("Je lance le robot");
    await setDateUpdate();

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
              important: false,
            };
            promises.push(addCompagny(newCompagny));
          }
        });
        await new Promise((resolve) => setTimeout(resolve, Number(process.env.TIMEOUT)));
      } catch (error) {
        console.error("Error:", error);
      }
    }
    await Promise.all(promises);
  } else {
    await setTryDate(currentDate);
    console.log("Je ne lance pas le robot");
  }
}
