const express = require('express');
const router = express.Router();
const reviewDestinationController = require('../controllers/reviewDestinationController');


router.get('/destination_review', reviewDestinationController.getAllReviewDestinations);


router.get('/destination_review/:id', reviewDestinationController.getReviewDestinationByDestinationId);


router.post('/destination_review', reviewDestinationController.createReviewDestination);


router.patch('/destination_review/:id', reviewDestinationController.updateReviewDestination);


router.delete('/destination_review/:id', reviewDestinationController.deleteReviewDestination);

module.exports = router;
