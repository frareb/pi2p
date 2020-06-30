const { exec } = require("child_process");
const express = require("express");
const { join } = require("path");

const router = express.Router();

router.post("/", (req, res) => {
	// invalid body: return error
	const reqBody = req.body;
	if(!reqBody)
		return res.status(400).send();

	// early return: do not deploy
	const action = reqBody.action;
	if(action !== "published")
		return res.status(204).send();
	
	const commitId = reqBody.release.target_commitish;
	const scriptPath = join(__dirname, "../bin/deploy.sh");

	// run the deploy script
	res.status(204).send();

	console.log("running deploy script");
	exec(`"${scriptPath}" ${commitId}`, (error, stdout, stderr) => {
		if(error) {
			console.error(`exec error: ${error}`);
			return;
		}

		console.log(`stdout: ${stdout}`);
		console.error(`stderr: ${stderr}`);
	});
});

module.exports = router;
