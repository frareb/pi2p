const { match } = require("path-to-regexp");
const crypto = require("crypto");

module.exports = config => async (req, res, next) => {
	// extract datas from request
	const {
		method,
		path,
	} = req;

	let authenticatorResult;

	let token = req.headers.authorization;
	let signature = req.get("X-Hub-Signature");

	// first method: extract SHA256-hashed bearer (less secured, easier)
	if(token && token.startsWith("Bearer ")) {
		token = crypto
			.createHash("sha256")
			.update(token.substring(7))
			.digest("base64");

		// try to match escalation
		authenticatorResult = await config.authenticator(token);
	} else if(signature) {
		// second method: compute HMAC from SHA-1 of secret (very
		// secured, quite hard and processor-consuming)
		// very specific, and only used for Git releases by now
		token = Buffer.from(signature, "utf-8");

		const computedToken = await config.releaser(
			JSON.stringify(req.body),
			config.deploy,
		);

		if(crypto.timingSafeEqual(token, computedToken)) {
			authenticatorResult = {
				group: config.deploy,
				props: {sensorId: []},
			};
		}
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
				// TODO: authenticator should be called anyway,
				// to get path-authorization for guest group
				.forEach(a => {
					const [k, v] = a;

					// TODO: allow non-integer parameters
					if(	!authenticatorResult.props ||
						!authenticatorResult.props[k].includes(parseInt(v))) {
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
