const express = require("express");
const { listAppointments, createAppointment, updateAppointment, deleteAppointment } = require("../controllers/appointmentController");

const router = express.Router();

router.get("/", listAppointments);
router.post("/", createAppointment);
router.put("/:id", updateAppointment);
router.delete("/:id", deleteAppointment);

module.exports = router;
