"use strict";

import { formatBiblio } from "./formatBiblio.js";

const biblioURL = 'https://api.zotero.org/groups/2520377/items?key=axXEhVlBUnltrZujRGzSf9Gf';
const divId = 'publiGroup';

formatBiblio(divId, biblioURL);
