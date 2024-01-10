
# <p align="center">SEARCHnGO</p>

Ce projet a été imaginé lors de ma recherche d'alternance. Je me suis dit que cela pourrait être bien d'avoir une liste de toutes les entreprises qui recherchent actuellement des développeurs et d'avoir leur adresse pour que je puisse postuler en personne en candidature spontanée. Donc c'est ce que j'ai fait. Je récupère, via un robot qui effectue des appels API (2 fois par semaine), les 110 dernières annonces en fonction de mes paramètres sur Google Jobs. Le robot trie les doublons et filtre les entreprises que je ne veux pas. Grâce à cela, je peux créer une carte avec leurs positions et avoir quelques options en plus.
## 🧐 Fonctionnalités
- 🗺️ Carte avec tous les points de toutes les entreprises (ceux en vert représentent ceux à qui j'ai pu donner mon CV).
![Screenshot 2024-01-10 143357](https://github.com/LucasDechaumet/searchNgo/assets/135183192/5a14ca43-9d7f-45b9-aece-fcdc40424b68)
  - ⚙️ Possibilité de modifier le métier à chercher, la ville de recherche et le rayon.
  - 📃 Exporter le tableau en PDF.
  - ❌ Pouvoir bannir un mot, que ce soit une entreprise ou "school", pour éviter les annonces des écoles.
  - ✍️ Ajouter une entreprise manuellement.
- 📊 Avoir un tableau regroupant toutes les entreprises et leurs informations.
![Screenshot 2024-01-10 143944](https://github.com/LucasDechaumet/searchNgo/assets/135183192/985bd319-67da-4858-bd42-7e6d986e58ed)
    - 📌 Cliquer sur leur nom pour être redirigé sur la carte sur le point précis.
    - 🟢 Se repérer via la couleur verte pour savoir à qui j'ai pu donner le CV.
    - ❌ Bannir le nom de l'entreprise ou le titre de l'annonce.
    - ✍️ Changer manuellement l'adresse de l'entreprise.
    - ✅ Pouvoir indiquer que le CV a été déposé.
    
## 🛠️ Tech Stack
- [TypeScript](https://www.typescriptlang.org/)
- [JavaScript](https://js.org/)
- [Nodejs](https://nodejs.org/)
- [Expressjs](https://expressjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/atlas/database)
