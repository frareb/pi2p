/* eslint-disable no-undef */
const controllers = require("../controllers");
const models = require("../models");

const model = models.Institutes;

beforeAll(async () => {
	// create the database
	await require("../migrations/20200416105614-create-institutes")
		.up(models.sequelize.queryInterface, models.Sequelize);

	// insert dummy datas into it
	await require("../seeders/20200416125253-dummy-institutes")
		.up(models.sequelize.queryInterface);
});

describe("body parser", () => {
	const bodyParser = controllers.body;

	test("correctly parse body", () => {
		const body = {
			name: "IRD",
			countryCode: "FRA",
		};

		const result = bodyParser({
			model,
			optionalFields: ["createdAt", "updatedAt"],
			body,
		});

		expect(result).toEqual(body);
	});

	test("discard additional parameters", () => {
		const body = {
			name: "IRD",
			countryCode: "FRA",
		};

		const result = bodyParser({
			model,
			optionalFields: ["createdAt", "updatedAt"],
			body: Object.assign({}, body, {
				dummy: "value",
			}),
		});

		expect(result).toEqual(body);
	});

	test("allow optional fields", () => {
		const body = {
			name: "IRD",
			countryCode: "FRA",
			createdAt: new Date(2042, 5, 25),
		};

		const result = bodyParser({
			model,
			optionalFields: ["createdAt", "updatedAt"],
			body,
		});

		expect(result).toEqual(body);
	});

	test("allow injectors", () => {
		const result = bodyParser({
			model,
			optionalFields: ["createdAt", "updatedAt"],
			body: {},
			inject: {
				name: "IRD",
				countryCode: () => "FRA",
				dummy: "value",
			},
		});

		expect(result).toEqual({
			name: "IRD",
			countryCode: "FRA",
		});
	});

	test("strict mode - disallow empty", () => {
		const body = {
			countryCode: "FRA",
		};

		try {
			bodyParser({
				model,
				optionalFields: ["createdAt", "updatedAt"],
				body,
			});
		} catch(e) {
			// eslint-disable-next-line max-len
			return expect(e).toEqual("SequelizeValidationError: undefined is not a valid string");
		}

		// force fail
		return expect(true).toEqual(false);
	});

	test("unstrict mode - allow empty", () => {
		const body = {
			countryCode: "FRA",
		};

		const result = bodyParser({
			model,
			optionalFields: ["createdAt", "updatedAt"],
			body,
			strict: false,
		});

		expect(result).toEqual(body);
	});

	test("unstrict mode - fail on optional", () => {
		const body = {
			name: "IRD",
			countryCode: "FRA",
			createdAt: new Date(2042, 5, 25),
		};

		try {
			bodyParser({
				model,
				optionalFields: ["createdAt", "updatedAt"],
				body,
				strict: false,
			});
		} catch(e) {
			return expect(e).toEqual("createdAt is not allowed in body");
		}

		// force fail
		return expect(true).toEqual(false);
	});
});
