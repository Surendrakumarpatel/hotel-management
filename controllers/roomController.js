const Room = require("../models/Room");

const getAll = async (req, res) => {
	const pageSize = 4;
	const page = Number(req.query.pageNumber) || 1;

	const keyword = req.query.keyword ? {
		$or: [
			{ name: { $regex: req.query.keyword, $options: "i" } },
			{ description: { $regex: req.query.keyword, $options: "i" } },
		]
	}
		: {};

	const numOfBeds = req.query.numOfBeds ? { numOfBeds: req.query.numOfBeds } : {};

	const category = req.query.roomType ? { category: req.query.roomType } : {};

	const count = await Room.countDocuments({ ...keyword, ...numOfBeds, ...category })

	const rooms = await Room.find({ ...keyword, ...numOfBeds, ...category }).limit(pageSize)
		.skip(pageSize * (page - 1));
	res.status(201).json({
		rooms,
		page,
		pages: Math.ceil(count / pageSize),
		count
	});
}

// @Desc Search rooms
// @Route /api/rooms/search/
// @Method GET
const searchRooms = async (req, res) => {
	const filterd = await Room.find({
		$and: [
			{ $or: [{ name: req.query.keyword }, { description: req.query.keyword }] },
			{ numOfBeds: req.query.numOfBeds },
			{ category: req.query.roomType }
		]
	});
	res.status(201).json(filterd);
}

// @Desc Get Single Room
// @Route /api/rooms/:id
// @Method GET
const getSingle = async (req, res) => {

	const room = await Room.findById(req.params.id);

	if (!room) {
		res.status(401);
		throw new Error("Room not found");
	}

	res.status(201).json(room);

}

// @Desc Create new room
// @Route /api/rooms
// @Method POST
const addRoom = async (req, res) => {

	const { type, roomNo } = req.body;
	let pricePerHour;
	if( type === "A" ){
		pricePerHour = 100;
	}
	else if( type === "B" ){
		pricePerHour = 80;
	}
	else{
		pricePerHour = 50;
	}

	const room = await Room.create({type, roomNo, pricePerHour});

	res.status(201).json(room);

}

// @Desc Update room
// @Route /api/rooms/:id
// @Method PUT
const updateRoom = async (req, res) => {

	let room = await Room.findById(req.params.id);

	if (!room) {
		res.status(401);
		throw new Error("Room not found");
	}

	if( req.body.type === "A" ){
		req.body.pricePerHour = 100;
	}
	else if( req.body.type === "B" ){
		req.body.pricePerHour = 80;
	}
	else{
		req.body.pricePerHour = 50;
	}

	room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });

	res.status(201).json(room);

}

// @Desc Delete room
// @Route /api/rooms/:id
// @Method DELETE
const deleteRoom = async (req, res) => {

	let room = await Room.findById(req.params.id);

	if (!room) {
		res.status(401);
		throw new Error("Room not found");
	}

	room = await Room.findByIdAndDelete(req.params.id);

	res.status(201).json({});

}

module.exports = {
	getAll, getSingle, addRoom, updateRoom, deleteRoom
}