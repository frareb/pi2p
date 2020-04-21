module.exports = token => {
	if(token === "demo") {
		return {
			group: "admin",
		};
	} else if(token === "gate") {
		return {
			group: "gateway",
			props: {
				sensorId: [1, 3],
			},
		};
	}
};
