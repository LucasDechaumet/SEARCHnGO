
# <p align="center">SEARCHnGO</p>
  
L'inspiration pour cette application est née de ma quête d'une alternance. En réfléchissant à la meilleure approche pour trouver des opportunités, j'ai envisagé la création d'une application facilitant le 
processus. L'idée est de mettre en place un tableau répertoriant les entreprises de développement actuellement en recherche, publiant des annonces. L'objectif est de fournir les informations nécessaires,
notamment les adresses des entreprises, afin que je puisse me rendre sur place et remettre mon CV en main propre pour une candidature spontanée. Donc 2 fois par semaine il y a un robot qui récupère les 
100 dernières annonces sur Google Jobs tout en évitant les doublons et les mots bannis. Cela crée une carte affichant toutes les entreprises, mais cela crée aussi un tableau répertoriant les adresses des entreprises.
    
## 🧐 Features
![all](https://github.com/LucasDechaumet/searchNgo/assets/135183192/8715c9aa-1ae8-4c27-b5eb-a45beeae8fd9)
- 🔧 Paramétrer le mot clé, la ville et enfin le rayon de recherche autour de la ville
- 📃 Exporter le tableau en PDF avec le nom et l'adresse de l'entreprise
- ❌ Bannir autant de mot que l'on ne veut pas dans le titre d'emploie recherché ou dans le nom de l'entreprise
- ✍️ Ajouter une entreprise manuellement
- ![map](https://github.com/LucasDechaumet/searchNgo/assets/135183192/f306438e-18b1-4078-9590-17635897ac94)
- 🗺️ Une carte regroupant toutes les entreprises enregistrées (les points rouges représentent les entreprises qui n'ont pas encore mon cv, les points verts représentn celle qui l'ont)
![tab](https://github.com/LucasDechaumet/searchNgo/assets/135183192/cb60e66e-897e-4771-90b0-0392a0b00bda)
- 🗒️ Un tableau faisant la liste de toutes les entreprises trouvées (Les entreprises avec un fond vert représente celles qui à qui j'ai pu transmettre mon CV)
![button](https://github.com/LucasDechaumet/searchNgo/assets/135183192/0c3b0fe7-75df-43ec-9880-5f51b5e9ca65)
- ❌ Un bouton "Ban entreprise" qui sert à supprimer et ne plus enregistrer cette entreprie, et un bouton "Ban titre" qui sert à ne plus enregistrer d'entreprise qui ont ce titre d'annonce EXACTEMENT.
- ✍️ Changer l'adresse manuellement car parfois l'API de google map n'arrive pas à trouver l'adresse exact
- ✅ Un bouton "CV déposé" qui disparait lorsque l'on clique dessus et qui sert à bien identifié quelles sont les entreprises à qui j'ai pu transmettre mon CV
        
## 🛠️ Tech Stack
- [NodeJS](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [JavaScript](https://js.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma](https://www.prisma.io/)
- [MongoDB Atlas](https://www.mongodb.com/atlas/database)

## ⌛ Logical Continuation
Si je devais continuer le développement...
- 🐙 Déployer l'application pour que tout le monde puisse y avoir accès et avoir son propre tableau en modifiant les paramètres.
- 💡 Réfléchir à un algo pour trouver l'itinéraire le plus rapide pour aller donner son CV pour un certain nombre d'entreprise.
        
