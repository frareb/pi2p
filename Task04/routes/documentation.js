const express = require("express");
const router = express.Router();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../config/swagger.json");
 
router.use("/api", swaggerUi.serve);
router.get("/api", swaggerUi.setup(swaggerDocument));

module.exports = router;
