const express = require("express");
const router = express.Router();
const resutlController = require("../../controllers/resultController");

router.post("/", resutlController.createResult);
router.get("/", resutlController.getAllResult);
router.delete("/:id", resutlController.deleteResult);

module.exports = router;
