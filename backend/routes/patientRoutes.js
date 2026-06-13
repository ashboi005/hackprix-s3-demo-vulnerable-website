const express = require("express");
const { listPatients, getPatientById } = require("../controllers/patientController");

const router = express.Router();

router.get("/", listPatients);
router.get("/:id", getPatientById);

module.exports = router;
