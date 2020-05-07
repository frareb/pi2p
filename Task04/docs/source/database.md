# Gestion de la base de données

Plutôt que de travailler en direct avec la base de données PostgreSQL, on utilise l'ORM ([*object-relational mapping*](https://fr.wikipedia.org/wiki/Mapping_objet-relationnel)) [Sequelize](https://sequelize.org/), permettant de gérer plus facilement la base de données. Le principe est que la base est abstraite en modèles, qui sont compatibles avec les modèles de donnés Javascript.

## Connexion à la base

La configuration des bases de données s'effectue via le fichier `config/config.json` ; pour le développement, une base de données locale PostgreSQL est utilisée, de nom `pi2p`, et avec un utilisateur éponyme disposant de tous les droits sur la base.

En production, la base est configurée en utilisant la variable d'environnement `DSN` ; cette variable peut être réglée dans une unité *systemd* par exemple ; pour les tests, on pourra lancer le programme localement comme suit :

```bash
NODE_ENV=production DSN=postgres://user:pass@example.com:port/database node www/bin
```

## Modélisation des données et relations

Chaque base de données a pour correspondance un modèle situé dans le dossier `models/` ; il dispose des mêmes champs que la table en base de données. Les types, eux, sont nécessairement différents, et c'est l'ORM qui assure la conversion, lorsqu'elle est nécessaire. Par exemple, un champ *DATE* en JS sera converti en champ *DATE* SQL lors de l'insertion des données.

Une fonctionnalité intéressante, qui étend les possibilités de SQL, sont les relations entre modèles ; sur une clef étrangère, il est possible, d'avoir des relations bi-directionnelles. Par exemple, une *gateway* dispose de plusieurs capteurs, et chaque capteur appartient à une unique *gateway* ; c'est une relation 1:N, on associe donc *Sensors* à *Gateways* via une relation `hasMany`, et *Gateways* à *Sensors* via une relation `belongsTo`, en spécifiant sur chacun **la clef étrangère du modèle multiple**, ici *Sensors*.

D'autres relations sont possibles, et documentées [dans le manuel](https://sequelize.org/v5/manual/associations.html) ; la procèdure pour trouver les fonctions à utiliser est d'abord de définir la relation :

- 1:1 : on ajoute `hasOne` des deux côtés, chacun référence la clef étrangère de l'autre, ou une seule table dispose d'une clef ;
- 1:N : c'est le cas le plus courant, on ajoute alors `belongsTo` au modèle ayant la clef et `hasMany` à l'autre modèle ;
- N:N : l'une des tables aura `hasMany` et l'autre `belongsToMany`, selon un choix plus ou moins arbitraire.

## Migrations

Les migrations sont utilisées pour créer automatiquement les tables en base de données. **Elles ne sont pas absoluement nécessaires**, mais permettent de suivre les modifications sur les tables en utilisant un gestionnaire de version (Git par exemple), et de s'assurer que la base de données correspond bien à la version du code actuellement déployée.

Pour lancer les migrations, il suffit d'exécuter la commande `sequelize db:migrate` après avoir installé le paquet `sequelize-cli` ; si la commande échoue, il faut vérifier les identifiants de la base de données. Pour annuler les migrations, il suffit d'exécuter la commande `sequelize db:migrate:undo:all`.

## Données de test

Les *seeders* sont un moyen simple d'obtenir des données de test pendant la phase de développement. Ils consistent en une addition brute de données dans les tables ; pour les obtenir, il suffit de lancer `sequelize db:seed:all`. Pour les supprimer, il suffit d'exécuter la commande `sequelize db:seed:undo:all`.

Le fonctionnement de Sequelize est très vaste, et seuls quelques points spécifiques au projet sont abordés ici ; en particulier, le travail avec les modèles (`find`, `update` et `delete`) n'est pas précisé, car il est bien détaillé dans la [documentation des modèles](https://sequelize.org/v5/class/lib/model.js~Model.html).
