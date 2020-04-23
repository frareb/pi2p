const { match } = require("path-to-regexp");

module.exports = config => (req, res, next) => {
	// extract datas from request
	const {
		method,
		path,
	} = req;

	let authenticatorResult;

	// extract bearer from headers
	let token = req.headers.authorization;
	if(token && token.startsWith("Bearer ")) {
		token = token.substring(7);

		// try to match escalation
		authenticatorResult = config.authenticator(token);
	}

	// if role is unknown, fallback to default
	if(	typeof authenticatorResult !== "object" ||
		!config.groups[authenticatorResult.group]) {
		authenticatorResult = {
			group: config.default,
		};
	}

	const role = authenticatorResult.group;

	// match authorization for path
	let auth = false;
	for(const authorizedPath of Object.keys(config.groups[role])) {
		const pattern = match(authorizedPath, { decode: decodeURIComponent });
		const result = pattern(path);

		if(result) {
			// check request parameters
			let paramsValid = true;
			Object.entries(result.params)
				.filter(a => isNaN(parseInt(a[0])))
				.forEach(a => {
					const [k, v] = a;
					
					if(!authenticatorResult.props[k].includes(parseInt(v))) {
						paramsValid = false;
					}
				});

			if(paramsValid) {
				auth = authorizedPath;
				break;
			}
		}
	}

	// match authorization for method
	if(auth) {
		auth = config.groups[role][auth].includes(method);
	}

	// send error if unauthorized
	if(!auth) {
		return res.status(403).send();
	}

	// allow connection if client goes here
	next();
};
