/**
 * Created by Michael on 2023/10/03.
 */

const express = require('express');
const router = express.Router();
const Reservations = require('../models/reservations');
const { checkPermission } = require('../components/common');
const tools = require('../components/common');

// Guest Make a Reservation
router.post('/reservations', async (req, res) => {
    try {
        const {
            guestName,
            guestContactInfo,
            expectedArrivalTime,
            reservedTableSize,
            reservationDate,
            token
        } = req.body;

        // Check user permission using the provided token
        //const { data, db } = await checkPermission(token);


        // if (data.error) {
        //     return res.status(data.code).json({ error: data.message });
        // }

        const newReservation = new Reservations({
            guestName: guestName, 
            contactInfo: guestContactInfo, 
            expectedArrivalTime: expectedArrivalTime,
            tableSize: reservedTableSize, 
            reservationDate: reservationDate, 
            status: 'confirmed'
        });

        const savedReservation = await newReservation.save();

        res.json(savedReservation);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

//Guest view his/her Reservation
router.get('/reservations',  async (req, res) => {
    try {
        const authorizationHeader = req.headers['authorization'];
        if (!authorizationHeader) {
           return res.status(401).json({ error: 'Token is not provided' });
        }

        // Extract the token from the "Bearer <token>" format
        const token = authorizationHeader.split(' ')[1];
        const decodedToken = tools.jwtDecode(token);
        const guestEmail = decodedToken.email;

        // Retrieve reservations for the guest by their email
        const reservations = await Reservations.find({ guestEmail });
        res.json(reservations);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});



// Get All Guest Reservations with Paging
router.get('/allreservations',  async (req, res) => {
    try {

        const authorizationHeader = req.headers['authorization'];
        if (!authorizationHeader) {
            return res.status(401).json({ error: 'Token is not provided' });
        }

        // Extract the token from the "Bearer <token>" format
        const token = authorizationHeader.split(' ')[1];
        const decodedToken = tools.jwtDecode(token);
        const userRole = decodedToken.role;
        // Check if the user is an employee
        if (userRole !== 'employee') {
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
router.get('/searchreservations', async (req, res) => {
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

// User Cancel own Reservation
router.delete('/reservations/:reservationId', async (req, res) => {
    try {
        const authorizationHeader = req.headers['authorization'];
        if (!authorizationHeader) {
            return res.status(401).json({ error: 'Token is not provided' });
        }

        // Extract the token from the "Bearer <token>" format
        const token = authorizationHeader.split(' ')[1];
        const decodedToken = tools.jwtDecode(token);
        const guestEmail = decodedToken.email;

        const { reservationId } = req.params;

        // Find the reservation by ID
        const reservation = await Reservation.findById(reservationId);

        // Check if the reservation exists
        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        // Check if the reservation belongs to the user
        if (reservation.guestEmail !== guestEmail) {
            return res.status(403).json({ error: 'Permission denied' });
        }

        // Remove the reservation
        await reservation.remove();

        res.json({ message: 'Reservation removed successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});


module.exports = router;