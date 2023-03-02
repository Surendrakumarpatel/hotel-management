const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({

    roomNo: {
        type: Number,
        unique: true,
        required: true
    },

    type: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: false,
        default: ""
    },

    images: [
        {
            image: String
        }
    ],

    pricePerHour: {
        type: Number,
        required: true,
    },

    address: {
        type: String,
        required: false,
    },

    guestCapacity: {
        type: Number,
        required: false,
    },

    numOfBeds: {
        type: Number,
        required: false,
    },

    internet: {
        type: Boolean,
        default: false,
    },

    breakfast: {
        type: Boolean,
        default: false,
    },

    airConditioned: {
        type: Boolean,
        default: false,
    },

    petsAllowed: {
        type: Boolean,
        default: false
    },

    roomCleaning: {
        type: Boolean,
        default: false
    },

    ratings: {
        type: Number,
        default: 0
    },

    numOfReviews: {
        type: Number,
        default: 0
    },

    category: {
        type: String,
        required: false,
        enum: ['King', 'Single', 'Twins']
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Room", roomSchema, "Rooms");
