# Gestion des permissions

## Principe général

Plutôt qu'une gestion d'accès par utilisateur, le contrôle d'accès mis en place propose une séparation en groupes, avec un affinage possible au sein des groupes pour l'accès à certaines URL. Chaque groupe dispose d'une ou plusieurs clefs d'API, lui donnant accès aux ressources de son groupe, et éventuellement à des ressources spécifiques.

Ces clefs d'API sont générées aléatoirement et cryptographiquement sûres ; pour être prise en compte, la clef doit être ajoutée dans l'entête `Authorization` de la requête, sous forme de `Bearer`. Une clef invalide ou une absence de clef fera automatiquement basculer l'utilisateur dans le groupe par défaut.

## Modèles de données

Le modèle `Groups` permet d'identifier un groupe par son nom (`name`), qui est l'identifiant unique utilisé dans le fichier de configuration pour gérer les permissions, et par une description (`description`), qui n'est pas utilisée par le système d'authentification, et sert simplement renseigner la raison d'être du groupe pour l'administrateur de l'API.

Le modèle `ApiKeys` décrit une clef d'accès (`key`) ; associée logiquement à un groupe (`groupId`), ces clefs possèdent également une clef étrangère (`gatewayId`), permettant la gestion fine des permissions pour les *gateways*. Chacune d'entre elle n'étant alors qu'en mesure de poster des données pour ses propres capteurs. De même que pour les groupes, chaque clef peut contenir une description, non utilisée par le logiciel, permettant de l'identifier (`description`).

## Organisation du code

Le code de la gestion d'accès se décompose globalement en trois fichiers :

- un plugin fonctionnant comme *middleware* express, et gérant les accès de façon générique ; il est très modulaire afin de pouvoir changer les méthodes d'authentification simplement (`authorization/plugin.js`) ;
- un *authenticator* (ou authentificateur), module pour le plugin sus-mentionné, qui renvoie les permissions associées à une clef d'accès via des requêtes en base de données (`authorization/authenticator.js`) ;
- un fichier de configuration de groupes, qui devrait idéalement disparaître à terme, et qui spécifie quel groupe a accès à quelles ressources (`/config/auth.json`).

## Configuration générale du plugin

Le plugin de gestion des permissions (`authorization/plugin.js`) contrôle toutes les requêtes passant par *express*. Il joue donc un rôle central dans l'application, et doit être configuré correctement. L'objet de configuration va comme suit :

- `groups` : description des permissions des groupes ;
- `default` : groupe utilisé en l'absence de clef d'accès, ou lorsqu'elle est invalide ;
- `authenticator` : fonction appelée pour récupérer les permissions associées à une clef.

### Description des permissions des groupes

L'objet de description des permissions (`/config/auth.json`) doit contenir, *a minima*, les permissions associées au groupe par défaut ; il peut éventuellement gérer d'autres groupes si nécessaire. Les clefs correspondent au nom du groupe, et les valeurs sont un autre objet clef-valeur, associant à l'URL d'une requête les méthodes d'accès autorisés.

```json
{
	"admin": {
		"/(.*)": ["GET", "POST", "DELETE", "PATCH"]
	},
	"guest": {
		"/institutes(.*)": ["GET"]
	}
}
```

L'objet ci-dessus confère au groupe `admin` le droit d'exécuter les méthodes *GET*, *POST*, *PATCH* et *DELETE* sur tous les points d'accès, et au groupe `guest` le droit d'exécuter une méthode *GET* sur toutes les URL commençant par `/institutes`, ainsi, `/institutes/1` est valide, mais pas `/sensors` par exemple. Pour plus d'informations sur la manière dont les URL sont traitées, voir la documentation de [path-to-regexp](https://www.npmjs.com/package/path-to-regexp).

### Description de l'authentificateur

Un authentificateur est une fonction, à laquelle on passe une clef d'accès, et qui renvoie la liste des permissions associées ; ici (`authorization/authenticator.js`), il fonctionne par requête en base de données, mais toute autre méthode peut être mise en place facilement. L'objet retourné contient les clefs suivantes :

- `group` : le groupe dans lequel se trouve la clef d'accès ;
- `props` (optionnel) : les paramètres permettant la gestion d'accès différenciée.

### Gestion d'accès différenciés dans un groupe

Les URL peuvent contenir des paramètres, et leur accès est alors limité aux paramètres autorisés par l'authentificateur. Par exemple, pour limiter l'accès à certains capteurs, on pourra donner des accès aux *gateways* comme suit, dans le fichier de description des permissions :

```json
{
	"gateway": {
		"/sensors/:sensorId/datas": ["POST"]
	}
}
```

Ici, si l'authentificateur retourne simplement le groupe `gateway`, aucun accès ne sera conféré ; il faut qu'il retourne également `{ props: { sensorId: [1, 5] } }`, par exemple, qui permettra au possesseur de la clef en question d'accéder à `/sensors/1/datas` et `/sensors/5/datas` mais pas à `/sensors/3/datas`.

## Groupes utilisés

Dans l'API REST ici réalisée, on distingue trois groupes distincts :

- `guest`, qui peut uniquement accèder aux informations non-sensibles (*gateways*, instituts, capteurs, données, etc) ;
- `gateway`, dont le seul droit est d'ajouter des données aux capteurs que possède la *gateway* (filtrés via des accès différenciés) ;
- `admin`, qui dispose de tous les droits sur tous les points d'accès.
