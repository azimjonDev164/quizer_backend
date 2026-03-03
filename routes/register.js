const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController");

router.post("/", registerController.handleNewUser);
router.post("/verify", registerController.handleVerify);
router.post("/resend-otp", registerController.handleReVerify);

module.exports = router;
