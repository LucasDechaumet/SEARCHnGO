import express from "express";
import prisma from "../prisma";

const router = express.Router();

router.get("/parameter", async (req, res) => {
  try {
    const response = await prisma.qParameter.findMany({
      where: {},
    });
    res.json(response);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Une erreur est survenue lors du traitement de la demande." });
  }
});

router.post("/chips", async (req, res) => {
  try {
    const body = req.body;
    if (
      body.keyword === undefined ||
      body.location === undefined ||
      body.lrad === undefined
    ) {
      throw new Error("Un ou plusieurs champs requis sont manquants.");
    } else {
      await prisma.qParameter.updateMany({
        where: {},
        data: {
          param: `${body.keyword}`,
          location: `${body.location}`,
          lrad: parseInt(body.lrad),
        },
      });
      res.send("Oui c'est bien la !");
    }
  } catch (error) {
    console.error("Error :", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/banCompagnie", async (req, res) => {
  try {
    const body = req.body;
    const id = body.id;
    const compagny_name = body.compagny_name;
    await prisma.compagnies.delete({
      where: {
        id: id,
      },
    });
    await prisma.banWords.create({
      data: {
        word: compagny_name,
      },
    });
    res.send("Bien supp");
  } catch (error) {
    console.error("Error:", error);
  }
});

router.post("/banTitle", async (req, res) => {
  try {
    const body = req.body;
    const id = body.id;
    const title = body.title;
    await prisma.compagnies.delete({
      where: {
        id: id,
      },
    });
    await prisma.banWords.create({
      data: {
        word: title,
      },
    });
    res.send("Bien supp");
  } catch (error) {
    console.error("Error:", error);
  }
});

router.post("/banWords", async (req, res) => {
  try {
    const body: string[] = req.body;
    body.forEach(async (banWord) => {
      await prisma.banWords.create({
        data: {
          word: banWord,
        },
      });
    });
    res.send("bien ajoutée");
  } catch (error) {
    console.error("Error:", error);
  }
});

router.post("/password", async (req, res) => {
  try {
    const body = req.body;
    const password = body.password;
    const prismaPassword = await prisma.password.findFirst({
      where: {
        password: password,
      },
    });
    if (prismaPassword === null) {
      res.json({ success: false, message: "Mot de passe incorrect" });
    } else {
      res.json({ success: true, message: "Mot de passe correct" });
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

export default router;
