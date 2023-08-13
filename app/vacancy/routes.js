const express = require("express");
const router = express.Router();
const { getExperiences } = require("./controllers");

router.get("/api/experiences", getExperiences);
module.exports = router;
