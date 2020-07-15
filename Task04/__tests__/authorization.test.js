/* eslint-disable no-undef */
const DummyServer = function() {
	this.stat = 0;
	this.result = {};
};

DummyServer.prototype.status = function(s) { this.stat = s; return this; };
DummyServer.prototype.send = function(r) { this.result = r; return this; };
DummyServer.prototype.json = DummyServer.prototype.send;

const dummyAuthenticator = token => ({
	group: token === "admin" ? "admin" : "guest",
	props: {
		param: [1],
	},
});

const plugin = require("../authorization/plugin")({
	groups: {
		"admin": {
			"/(.*)": ["GET"],
		},
		"guest": {
			"/allow": ["GET"],
			"/disallow/:param": ["GET"],
		},
	},
	default: "guest",
	authenticator: dummyAuthenticator,
});

const promisifyPlugin = (req, res) => new Promise((resolve, reject) => {
	plugin(req, res, () => {
		resolve(res.stat);
	});

	setTimeout(() => reject(res.stat), 1000);
});

const allowGetHeader = obj => {
	return Object.assign({}, obj, {
		get: prop => obj[prop],
	});
};

describe("simple groups", () => {
	test("disallow stranger", async () => {
		const res = new DummyServer();

		expect(promisifyPlugin(allowGetHeader({
			method: "GET",
			path: "/disallow",
			headers: {},
		}), res)).rejects.toEqual(403);
	});

	test("allow stranger", () => {
		const res = new DummyServer();

		expect(promisifyPlugin(allowGetHeader({
			method: "GET",
			path: "/allow",
			headers: {},
		// simply calls next, without setting status code
		}), res)).resolves.toEqual(0);
	});

	test("allow admin wildcard", () => {
		const res = new DummyServer();

		expect(promisifyPlugin(allowGetHeader({
			method: "GET",
			path: "/disallow",
			headers: {
				authorization: "Bearer admin",
			},
		}), res)).resolves.toEqual(0);
	});
});

describe("url parameters", () => {
	test("disallow invalid", () => {
		const res = new DummyServer();

		expect(promisifyPlugin(allowGetHeader({
			method: "GET",
			path: "/disallow/0",
			headers: {
				// BUG: bearer is necessary to get path-perms
				authorization: "Bearer guest",
			},
		}), res)).rejects.toEqual(403);
	});

	test("allow authorized", () => {
		const res = new DummyServer();

		expect(promisifyPlugin(allowGetHeader({
			method: "GET",
			path: "/disallow/1",
			headers: {
				authorization: "Bearer guest",
			},
		}), res)).resolves.toEqual(0);
	});
});
