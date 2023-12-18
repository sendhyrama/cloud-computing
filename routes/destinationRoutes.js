const express = require('express');
const router = express.Router();
const destinationController = require('../controllers/destinationController');

// Get all destination 
router.get('/destinations', destinationController.getAllDestinations);

// Get destination  by ID
router.get('/destinations/:id', destinationController.getDestinationsById);

// Get destination  by ID Category
router.get('/destination/cat/:id', destinationController.getDestinationsByCategoryId);

// Create a new destination 
router.post('/destinations', destinationController.createDestination);

// Update an destination  by ID
router.patch('/destinations/:id', destinationController.updateDestination);

// Delete an destination by ID
router.delete('/destination/:id', destinationController.deleteDestination);

module.exports = router;