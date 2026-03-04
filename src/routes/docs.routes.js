const router = require("express").Router();
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

const openapiPath = path.join(__dirname, "..", "docs", "openapi.yaml");
const spec = YAML.load(openapiPath);

router.use("/", swaggerUi.serve);
router.get("/", swaggerUi.setup(spec));

module.exports = router;