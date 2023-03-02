const express = require('express');
const { getAll, getSingle, newBooking, editBooking, cancelBooking, checkRoomIsAvailble, getBookedDates, deleteBooking } = require('../controllers/bookingController');

const router = express.Router();

router.route("/").post(newBooking).get(getAll);
router.route("/check").post(checkRoomIsAvailble);
router.route("/dates/:roomId").get(getBookedDates);
router.route("/:id").get(getSingle).delete(deleteBooking).put(editBooking);
router.route("/cancel/:id").get(cancelBooking);

module.exports = router;