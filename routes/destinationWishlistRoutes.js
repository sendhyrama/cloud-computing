const express = require('express');
const router = express.Router();
const destinationWishlistController = require('../controllers/destinationWishlistController');

// Get wishlist by ID
router.get('/destination_wishlist/:id', destinationWishlistController.getWishlistDestinationByUserId);

// Add a new wishlist
router.post('/destination_wishlist', destinationWishlistController.createWishlistDestination);

// Delete an wishlist by ID
router.delete('/destination_wishlist/:id', destinationWishlistController.deleteWishlistDestination);

module.exports = router;