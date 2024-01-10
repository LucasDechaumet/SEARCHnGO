import prisma from "../prisma";

export async function getqParam() {
  try {
    const response = await prisma.qParameter.findFirst();
    const q = response?.param;
    return q;
  } catch (error) {
    console.error(error);
  }
}

export async function getLocation() {
  try {
    const response = await prisma.qParameter.findFirst();
    const location = response?.location;
    return location;
  } catch (error) {
    console.error(error);
  }
}

export async function getlrad() {
  try {
    const response = await prisma.qParameter.findFirst();
    const lrad = response?.lrad;
    return lrad;
  } catch (error) {
    console.error(error);
  }
}

export async function addCompagny(compagny: Compagny) {
  try {
    const response = await prisma.compagnies.create({
      data: {
        ...compagny,
      },
    });
  } catch (error) {
    console.error("Error adding compagny:", error);
  }
}

export async function alreadyInDb(name: string): Promise<boolean> {
  try {
    const findFirst = await prisma.compagnies.findFirst({
      where: { compagny_name: name },
    });
    if (findFirst == null) {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
  return true;
}

export async function getBanWords(): Promise<string[]> {
  let listBanWords: string[] = [];
  try {
    const response = await prisma.banWords.findMany({
      where: {},
    });
    response.forEach((banWord) => {
      listBanWords.push(banWord.word);
    });
    return listBanWords;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function hasBanWord(compagnies: JobResult): Promise<boolean> {
  const banWords = await getBanWords();
  for (const banWord of banWords) {
    if (
      compagnies.title.toLowerCase() === banWord.toLowerCase() ||
      compagnies.company_name.toLowerCase() === banWord.toLowerCase()
    ) {
      return true;
    }
  }
  return false;
}

const API_KEY = process.env.API_KEY_GEOCODE;
const URL_GEOCODE = "https://maps.googleapis.com/maps/api/geocode/json?";

export async function getAdress(name: string, city: string) {
  try {
    const response = await fetch(
      `${URL_GEOCODE}address=${encodeURIComponent(`${name} ${city}`)}&key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.results[0];
  } catch (error) {
    console.error("Error:", error);
  }
}
