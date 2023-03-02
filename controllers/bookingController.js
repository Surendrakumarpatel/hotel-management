 const Booking = require("../models/Booking");
 const Room = require("../models/Room");
 
 const newBooking = async (req, res) => {

    const { roomNo,  startTime: checkInDate, endTime: checkOutDate } = req.body;

    const booking = await Booking.create({
        roomNo,
        checkInDate,
        checkOutDate,
        bookedAt: Date.now(),
    });

    res.status(201).json(booking);

}

// @Desc Check room is available for booking
// @Route /api/bookings/check
// @Method POST
 const checkRoomIsAvailble = async (req, res) => {

    console.log(req.body);
    const { roomNo,  startTime: checkInDate, endTime: checkOutDate, email, paymentType, tips } = req.body;

    const room = await Booking.find({ roomNo: roomNo, $and: [{
            checkInDate: {
                $lte: checkOutDate
            }
        }, {
            checkOutDate: {
                $gte: checkInDate
            }
        }]});

    let roomAvailable;

    if(room && room.length === 0) {
        roomAvailable = true;
        const room = await Room.findOne({ roomNo: roomNo });
        if(!room){
            res.json({message: "There is no such room."});
            return;
        }
        const date1 = new Date(checkInDate).getTime();
        const date2 = new Date(checkOutDate).getTime();
        var hours = Math.abs(date1 - date2) / 36e5;
        let amount = hours * room.pricePerHour;
        const booking = await Booking.create({
            roomNo,
            email,
            room: room._id,
            checkInDate,
            checkOutDate,
            amountPaid: amount + (amount * (tips/100)),
            bookedAt: Date.now(),
            tips,
            paymentType
        });
    } else {
        roomAvailable = false;
    }

    res.status(201).json({ roomAvailable });

}


// @Desc Get booked dates
// Route /api/bookings/dates/:roomId
// @Route GET
 const getBookedDates = async (req, res) => {

    const bookings = await Booking.find({ room: req.params.roomId });

    let bookedDates = [];

    const timeDiffernece = moment().utcOffset() / 60;

    bookings.forEach((booking) => {

        const checkInDate = moment(booking.checkInDate).add(timeDiffernece, 'hours')
        const checkOutDate = moment(booking.checkOutDate).add(timeDiffernece, 'hours')

        const range = moment.range(moment(checkInDate), moment(checkOutDate));

        const dates = Array.from(range.by('day'));
        bookedDates = bookedDates.concat(dates);
    })

    res.status(200).json(bookedDates);

}

// @Desc Get all bookings
// @Route /api/bookings
// @Method GET
 const getAll = async (req, res) => {
    const pageSize = 4;
    const page = Number(req.query.pageNumber) || 1;
    const count = await Booking.countDocuments();
    const bookings = await Booking.find({}).populate("room").limit(pageSize).skip(pageSize * (page - 1));
    res.status(201).json({
        bookings,
        page,
        pages: Math.ceil(count / pageSize),
        count
    });
}

const getSingle = async (req, res) => {
    const id = req.params.id;
    const booking = await Booking.findOne({_id: id}).populate("room");
    res.status(201).json({
        booking
    });
}

// @Desc Delete booking 
// @Route /api/bookings/:id
// @Method DELETE
 const deleteBooking = async (req, res) => {

    const booking = await Booking.findById(req.params.id);

    if(!booking) {
        res.status(401);
        throw new Error("Booking not found");
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.status(201).json({});

}

// @Desc Update Booking
// @Route /api/rooms/:id
// @Method PUT
const editBooking = async (req, res) => {

	let room = await Room.findById(req.body.room._id);
	if (!room) {
		res.status(201).json({message: "Room not found"});
        return;
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


    const date1 = new Date(req.body.checkInDate).getTime();
    const date2 = new Date(req.body.checkOutDate).getTime();
    var hours = Math.abs(date1 - date2) / 36e5;
    let amount = hours * room.pricePerHour;

	room = await Booking.findByIdAndUpdate(req.params.id, {...req.body,amountPaid: amount}, { new: true });

	res.status(201).json({message: "Booking updated"});

}

// @Desc Cancel Booking
// @Route /api/rooms/:id
// @Method GET
const cancelBooking = async (req, res) => {

    console.log("Cancel "  +req.params.id);

    let booking = await Booking.findById(req.params.id);


    const date1 = new Date(booking.checkInDate).getTime();
    const date2 = new Date(Date.now());
    var hours = Math.abs(date1 - date2) / 36e5;

    let refund;
    if( hours > 48 ){
        refund = "Complete";
    }
    else if( hours > 24 && hours < 48){
        refund = "Half";
    }
    else{
        refund = "No refund";
    }
	

	const update = await Booking.findByIdAndUpdate(req.params.id, {
        refund,
        status: "Canceled",
    }, { new: true });

	res.status(201).json({message: "Booking Cancelled"});

}

module.exports = {
    getAll, getSingle, newBooking, editBooking, cancelBooking, checkRoomIsAvailble, getBookedDates, deleteBooking
}