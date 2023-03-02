const express = require('express');
const { getAll, getSingle, addRoom, updateRoom, deleteRoom, createRoomReview } = require('../controllers/roomController');

const router = express.Router();

router.route("/").get(getAll).post( addRoom );
router.route("/:id").get(getSingle).put(updateRoom).delete(deleteRoom);

module.exports = router;