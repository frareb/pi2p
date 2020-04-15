# Tâche 4. Création d'une API REST

**Responsable** : Titouan
**Date de restitution** : ?

Une fois les données récupérées par la *gateway*, il faut fournir une interface permettant d'enregistrer ces données en base de données ; par la même occasion, cette interface permettra également de récupérer ces données par la suite afin de réaliser des graphes interactifs côté client.

L'idée générale du projet est de réaliser un serveur possédant une API *REST* pour sa communication avec l'extérieur. Elle regroupe donc les tâches 4 (communication avec la Rasperry Pi), 5 (stockage des informations en base de données) et 6 (récupération des informations par le client) initialement prévues.

## Fonctionnement

### Installation des dépendances

Ce projet est basé sur [Node.js](https://nodejs.org/en/), et se base en particulier sur [express.js](https://expressjs.com/) et l'ORM [Sequelize](https://sequelize.org/), permettant de gérer plus facilement la base de données. Pour installer localement toutes les dépendances du projet, il faut lancer un `npm install`.

### Base de données

La configuration des base de données s'effectue via le fichier `config/config.json` ; pour le développement, une base de données locale PostgreSQL est utilisée, de nom `pi2p`, et avec un utilisateur éponyme disposant de tous les droits sur la base.

Une fois la base de données créé, il faut lancer les migrations pour s'assurer que les tables sont correctes en lançant `sequelize db:migrate` ; la commande ne devrait pas échouer ; si c'est le cas, inutile d'aller plus loin, vérifiez votre configuration.

### Lancement du projet

Pour faciliter les tests, le projet possède pendant toute la phase de développement une interface de lancement rapide mono-processus ; il suffit de lancer `npm start`, et le projet tourne sur le port local 3000 (`http://localhost:3000`).

### Tests et démonstration

Le projet n'en est encore qu'à ses premier balbutiements, mais il dipose déjà d'une page d'accueil rudimentaire à l'adresse mentionné ci-dessus, il suffit de s'y rendre dans un navigateur. Cette page, en fait générée dynamiquement, est une simple démonstration des possibilités d'express.

Afin de tester l'API, un premier point d'accès a été mis en place (même s'il est très rudimentaire), à l'adresse `http://localhost:3000/sensors`, il accepte les requêtes POST, avec pour paramètres `{name, location, unit}` et une requête GET retourne l'ensemble des capteurs précédemment enregistrés.