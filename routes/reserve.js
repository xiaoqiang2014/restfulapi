/**
 * Created by Michael on 2023/10/03.
 */

const express = require('express');
const router = express.Router();
const Reservations = require('../models/reservations');
const { checkPermission } = require('../components/common');

// Guest Make a Reservation
router.post('/reservations', async (req, res) => {
    try {
        const {
            guestName,
            guestContactInfo,
            expectedArrivalTime,
            reservedTableSize,
            status,
            token
        } = req.body;

        // Check user permission using the provided token
        const { data, db } = await checkPermission(token);

        if (data.error) {
            return res.status(data.code).json({ error: data.message });
        }

        const newReservation = new Reservations({
            guestName,
            guestContactInfo,
            expectedArrivalTime,
            reservedTableSize,
            status
        });

        const savedReservation = await newReservation.save();

        res.json(savedReservation);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    } finally {
        if (db) {
            db.close();
        }
    }
});

//Guest view his/her Reservation
router.get('/reservations',  async (req, res) => {
    try {
        const guestEmail = req.userData.email;

        // Retrieve reservations for the guest by their email
        const reservations = await Reservations.find({ guestEmail });

        res.json(reservations);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});


// Guest Update Reservation
router.put('/reservations/:reservationId',  async (req, res) => {
    try {
        const { reservationId } = req.params;
        const { guestName, guestContactInfo, expectedArrivalTime, reservedTableSize } = req.body;
        const guestEmail = req.userData.email;

        // Check if the reservation exists and belongs to the guest
        const reservation = await Reservations.findOne({ _id: reservationId, guestEmail });

        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        // Update the reservation with the new information
        reservation.guestName = guestName;
        reservation.guestContactInfo = guestContactInfo;
        reservation.expectedArrivalTime = expectedArrivalTime;
        reservation.reservedTableSize = reservedTableSize;

        const updatedReservation = await reservation.save();

        res.json(updatedReservation);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

// Get All Guest Reservations with Paging
router.get('/reservations',  async (req, res) => {
    try {
        // Check if the user is an employee
        if (req.userData.role !== 'employee') {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Retrieve page and page size from query parameters
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        // Calculate the skip value based on the page and page size
        const skip = (page - 1) * pageSize;

        // Retrieve guest reservations with paging
        const reservations = await Reservations.find({})
            .skip(skip)
            .limit(pageSize);

        res.json(reservations);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

// Get Guest Reservations with Search
router.get('/reservations', async (req, res) => {
    try {
        // Check if the user is an employee
        if (req.userData.role !== 'employee') {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Retrieve search parameters from query parameters
        const { date, status } = req.query;

        // Create a query object for filtering
        const query = {};

        // Add date filter if provided
        if (date) {
            // Assuming the date parameter is in ISO format (e.g., '2023-03-10')
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1); // Add one day to include the entire day

            query.date = {
                $gte: startDate,
                $lt: endDate
            };
        }

        // Add status filter if provided
        if (status) {
            query.status = status;
        }

        // Retrieve guest reservations with search filters
        const reservations = await Reservations.find(query);

        res.json(reservations);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

// Update User Reservation
router.put('/reservations/:reservationId',  async (req, res) => {
    try {
        // Check if the user is an employee
        if (req.userData.role !== 'employee') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const { reservationId } = req.params;
        const { status } = req.body;

        // Find the reservation by ID
        const reservation = await Reservation.findById(reservationId);

        // Check if the reservation exists
        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        // Update the reservation status
        reservation.status = status;

        // Save the updated reservation
        await reservation.save();

        res.json(reservation);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});


module.exports = router;