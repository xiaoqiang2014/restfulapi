/**
 * Created by Michael on 2023/10/03.
 */
const mongoose = require('mongoose');

// Define the reservation schema
const reservationSchema = new mongoose.Schema({
    guest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    guestName: {
        type: String,
        required: true
    },
    contactInfo: {
        type: String,
        required: true
    },
    expectedArrivalTime: {
        type: String,
        required: true
    },
    tableSize: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled'],
        default: 'confirmed'
    },
    reservationDate: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the Reservation model
const Reservation = mongoose.model('reservations', reservationSchema);

module.exports = Reservation;