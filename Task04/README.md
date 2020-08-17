# Tâche 4. Création d'une API REST

**Responsable** : Titouan

**Date de restitution** : Juillet 2020

Une fois les données récupérées par la *gateway*, il faut fournir une interface permettant d'enregistrer ces données en base de données ; par la même occasion, cette interface permettra également de récupérer ces données par la suite afin de réaliser des graphes interactifs côté client.

L'idée générale du projet est de réaliser un serveur possédant une API *REST* pour sa communication avec l'extérieur. Elle regroupe donc les tâches 4 (communication avec la Rasperry Pi), 5 (stockage des informations en base de données) et 6 (récupération des informations par le client) initialement prévues.

## Fonctionnement

### Installation des dépendances

Ce projet est basé sur [Node.js](https://nodejs.org/en/), et se base en particulier sur [express.js](https://expressjs.com/) et l'ORM [Sequelize](https://sequelize.org/), permettant de gérer plus facilement la base de données. Pour installer localement toutes les dépendances du projet, il faut lancer un `npm install`.

### Base de données

La configuration des base de données s'effectue via le fichier `config/config.json` ; pour le développement, une base de données locale PostgreSQL est utilisée, de nom `pi2p`, et avec un utilisateur éponyme disposant de tous les droits sur la base.

Une fois la base de données créée, il faut lancer les migrations pour s'assurer que les tables sont correctes en lançant `sequelize db:migrate` ; la commande ne devrait pas échouer ; si c'est le cas, inutile d'aller plus loin, vérifiez votre configuration.

### Lancement du projet

Pour faciliter les tests, le projet possède pendant toute la phase de développement une interface de lancement rapide mono-processus ; il suffit de lancer `npm start`, et le projet tourne sur le port local 3000 (`http://localhost:3000`).

### Authentification

L'accès à l'API est restreint ; l'accès se subdivise en trois groupes :

- `guest`, qui peut uniquement accèder aux informations non-sensibles (*gateways*, instituts, capeurs, données, etc) ;
- `gateway`, dont le seul droit est d'ajouter des données aux capteurs que possède la *gateway* ;
- `admin`, qui dispose de tous les droits sur tous les points d'accès.

L'authentification est gérée avec des clefs générées aléatoirement et cryptographiquement sûres. La clef, pour être prise en compte, doit être ajoutée dans l'entête `Authorization` de la requête, sous forme de `Bearer`. Le groupe par défaut est `guest`, il sera utilisé si la clef est invalide ou absente.

Une clef administrateur par défaut est générée de manière **non-aléatoire**, afin de permettre un premier accès. Cette clef est `firstUniqueId` pour la version de développement (il faudra évidemment la changer en production) ; pour utiliser cette clef, on passe en entête :

```
Authorization: Bearer firstUniqueId
```

### Tests et démonstration

Le projet n'en est encore qu'à ses premiers balbutiements, mais il dipose déjà d'une page d'accueil rudimentaire à l'adresse mentionnée ci-dessus, il suffit de s'y rendre dans un navigateur. Cette page, en fait générée dynamiquement, est une simple démonstration des possibilités d'express.

### Génération de la documentation

La documentation du projet est séparée en deux parties : d'une part Swagger génère une documentation de l'API interactive, permettant de tester les différents points d'accès ; cette documentation est générée à partir du fichier de description `config/swagger.json`, qui suit le standard [OpenAPI v3.0](https://swagger.io/specification/).

D'autre part, des documentations statiques sont rédigées manuellement, et decrivent en détails le fonctionnement du code. Pour une plus grande facilité d'écriture, ces documentations sont écrites en Markdown, puis générées par la suite ; la génération est faite en utilisant `npm run doc`, qui appellera le bon script.

Une fois générées, cette documentation statiques est accessible sur `/documentation/*.html`, pour chacun des fichiers Markdown. La documentation générée par Swagger est quant à elle disponible sur `/documentation/api`, puis il suffit de suivre les chemins internes ensuite.
