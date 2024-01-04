import express from "express";
import prisma from "../prisma";

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

export default router;
