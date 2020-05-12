# Description des contrôleurs

## Intérêt global

Les contrôleurs sont une couche d'abstraction au-dessus de l'[ORM]((https://fr.wikipedia.org/wiki/Mapping_objet-relationnel)) ; grâce à eux, on obtient un patron de conception [MVC](https://fr.wikipedia.org/wiki/Mod%C3%A8le-vue-contr%C3%B4leur) complet ; ils visent en particulier à éviter les redondances dans le code des routes, qui doivent se contenter d'appeler un contrôleur associé.

Bien qu'il ne soit pas un contrôleur à proprement parler, le fonctionnement de `routes/factory` sera documenté ici, car son cadre de réutilisation est similaire à celui des contrôleurs.

## Contrôleurs POST et PATCH

Les deux contrôleurs POST et PATCH ont une structure très simple et reposent en grande partie sur un contrôleur connexe : le `bodyParser`, chargé de vérifier que le contenu du corps de la requête correspond bien au modèle.

Globalement, ces deux contrôleurs tentent de récupérer les arguments de la requête via ce parseur, puis exécutent la méthode correspondante en base de données (UPDATE pour PATCH et INSERT pour POST), et retournent l'élément inséré ou modifié ; c'est pourquoi le PATCH exécute deux requêtes : une pour modifier les données, et une pour récupérer les données modifiées.

Ces deux contrôleurs ne prennent qu'un seul argument : `model`, qui est le modèle à traiter ; tous les autres arguments, s'il y en a, seront passés au `bodyParser`. Ce parseur, plutôt complexe mais très modulaire, accepte quant à lui les paramètres suivants :

- `model` : modèle de la base de données à traiter ;
- `optionalFields` : champs optionnels du modèle, qui seront insérés automatiquement s'ils sont absents ; cela concerne en particulier les champs `createdAt` et `updatedAt`, qui ne sont pas obligatoires dans une requête ;
- `inject` : liste clef : valeur de paramètres fictifs rajoutés au contenu du corps de la requête avant traitement. La clef est le nom du paramètre, la valeur est une chaine de caractères à insérer, ou une fonction retournant une chaine de caractères ;
- `strict` : précise si une erreur est renvoyée lorsqu'un ou plusieurs des paramètres du modèle, hormis ceux mentionnés dans `optionalFields`, sont absents ; le mode strict est activé par défaut, mais n'est pas utile pour les requêtes *PATCH* par exemple.

## Contrôleurs GET

Deux contrôleurs coexistent pour la méthode *GET* ; l'un permet de filtrer une collection de données, quand l'autre accède à un élément individuel de la collection (une ressource membre). Ces deux contrôleurs semblent complexes parce qu'ils construisent des liens absolus, mais sont en réalité très simples d'utilisation. Les paramètres possibles sont les suivants :

- `model` : modèle de la base de données à traiter ;
- `find` : paramètres passés à la méthode [`find*`](https://sequelize.org/v5/class/lib/model.js~Model.html#static-method-findAll) de Sequelize pour filtrer les résultats ; certains paramètres sont forcés par le contrôleur, en particulier pour la pagination ou l'ordonnancement ;
- (collection uniquement) `pageSize` : la taille de page par défaut pour le filtrage des données ;
- (collection uniquement) `removeModelUrl` : ne pas retourner les liens des ressources enfant ;
- (ressource uniquement) `include` : modèles dépendants à inclure dans le corps de la réponse ;
- (ressource uniquement) `unifyMultipleLinks` : pour les modèles dépendants multiples, les regrouper en un seul lien au lieu d'une collection.

Le contrôleur de collection se base en outre sur les paramètres de la requête pour filtrer les résultats ; les *query strings* suivants sont utilisés pour faire du filtrage :

- `page` : numéro de la page à consulter ;
- `page_size` : nombre d'éléments par page ;
- `start` : filtrage chronologique : données après cette date uniquement ;
- `end` : filtrage chronologique : données avant cette date uniquement.

## Paramètres du DELETE

Le contrôleur *DELETE* est extrêmement simple : il supprime la ressource donnée ; seuls deux paramètres sont possibles :

- `model` : modèle de la base de données à traiter ;
- `deleteAll` : booléen indiquant de supprimer **toute la collection** plutôt qu'une seule ressource.

## Constructeur de routes

Le constructeur de routes (`routes/factory`) n'est pas un contrôleur à proprement parler, mais fait appel aux contrôleurs pour créer automatiquement toutes les routes liées à un modèle ; il est actuellement utilisé pour environ 90% des routes, ce qui permet d'éviter le code redondant. Il possède les paramètres suivants :

- `model` : modèle de la base de données à traiter ;
- `router` : routeur à utiliser comme base des requêtes ;
- `optionalFields` : champs optionnels du modèle, qui seront insérés automatiquement s'ils sont absents lors des POST ; les champs `id`, `createdAt` et `updatedAt` sont ajoutés automatiquement, il est donc inutile de les mettre manuellement, sauf dans les cas ou la date de création est différente de la date actuelle (cas des données des capteurs).

Depuis ces informations, les modèles enfants sont immédiatement récupérés et pris en compte lors des requêtes *GET*.

*[MVC]: Modèle-Vue-Contrôleur
*[ORM]: Object-Relational Mapping