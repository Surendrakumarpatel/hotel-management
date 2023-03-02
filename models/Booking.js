const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

    room: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Room',
        required: true,
    },
    email: {
        type: String,
        required: true
    },

    roomNo: {
        type: Number,
        required: true,
    },

    checkInDate: {
        type: Date,
        required: true,
    },

    checkOutDate: {
        type: Date,
        required: true,
    },

    amountPaid: {
        type: Number,
        required: false,
    },

    daysOfStay: {
        type: Number,
        required: false,
    },

    paymentType: {
        type: String,
        required: false
    },
    paidAt: {
        type: Date,
        required: false
    },
    bookedAt: {
        type: Date,
        required: false
    },

    status: { 
        type: String,
        default: 'Active', 
    },

    refund: { 
        type: String,
        default: 'Nil', 
    },

    tips: {
        type: Number,
        required: false,
        default: 0,
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Booking", bookingSchema);
