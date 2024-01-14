import express from "express";
import prisma from "../prisma";
import { addCompagny, alreadyInDb, getAdress } from "../robot/utils";

const router = express.Router();

router.put("/changeAdress/:name", async (req, res) => {
  try {
    const body = req.body;
    const compagny_name = req.params.name;
    const response = await prisma.compagnies.update({
      where: {
        compagny_name: compagny_name,
      },
      data: {
        address: body.adress,
      },
    });
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/allCompagnies/:keyword", async (req, res) => {
  try {
    const keyword = req.params.keyword;
    if (keyword === undefined) {
      throw new Error("Keyword manquant");
    }

    const response = await prisma.compagnies.findMany({
      where: {
        q_parameter: keyword,
      },
    });

    res.json(response);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Une erreur est survenue lors du traitement de la demande." });
  }
});

router.put("/importantCompagny/:name", async (req, res) => {
  try {
    const compagny_name = req.params.name;
    const response = await prisma.compagnies.update({
      where: {
        compagny_name: compagny_name,
      },
      data: {
        important: true,
      },
    });
    console.log(response);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/removeImportantCompagny/:name", async (req, res) => {
  try {
    const compagny_name = req.params.name;
    const response = await prisma.compagnies.update({
      where: {
        compagny_name: compagny_name,
      },
      data: {
        important: false,
      },
    });
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/metCompagny/:name", async (req, res) => {
  try {
    const compagny_name = req.params.name;
    const response = await prisma.compagnies.update({
      where: {
        compagny_name: compagny_name,
      },
      data: {
        met: true,
      },
    });
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/addCompagny", async (req, res) => {
  const body = req.body;
  const boolean = await alreadyInDb(body.compagny_name);

  if (!boolean) {
    try {
      const response = await getAdress(body.compagny_name, body.location);
      const address = response.formatted_address;
      const coords = response.geometry.location;
      const compagny: Compagny = {
        compagny_name: body.compagny_name,
        q_parameter: body.q_parameter,
        title: "Ajouté manuellement",
        location: body.location,
        address: address,
        coords: coords,
        met: false,
        important: false,
      };
      await addCompagny(compagny);
      res.send("bien ajoutée");
    } catch (error) {
      console.error(error);
    }
  } else {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
