const sequelize = require('sequelize');
const db = require("../models");
const reviewDestination = db.review_destinations;
const {updateAverageRating} = require('./destinationController')

// Get all Review destination
const getAllReviewDestinations = async (req, res) => {
    try {
      const review_destinations = await reviewDestination.findAll({
        include: [
            {
              model: db.users,
              attributes: ["user_fullname"]
            },
            {
              model: db.destinations,
              attributes: ["destination_name"],
            }
          ]
      });
      return res.status(200).json({status: 'Success', message: 'Data retrieved successfully!', data: review_destinations});
    } catch (e) {
      console.log(e);
      }
  };

// Get Review attractions by ID
const getReviewDestinationById = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const review_destinations = await reviewDestination.findByPk(id, {
        include: [
          {
            model: db.users,
            attributes: ["user_username"]
          },
          {
            model: db.destinations,
            attributes: ["destination_name"],
          }
        ]
      });
      if (db.destination_reviews) {
        return res.status(200).json({status: 'Success', message: 'Data retrieved successfully!', data: review_destinations.toJSON() });
      } else {
        console.log('Review not found');
        res.status(404).json({ error: 'Review not found' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  const getReviewDestinationByDestinationId = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const review_destinations = await reviewDestination.findAll({
        include: [
          {
            model: db.destinations,
            where: { detination_id: id },
            attributes: ["destination_name"]
        },
        {
            model: db.users,
            attributes: ["user_fullname"]
        }
        ],
      });
      if (review_destinations.length > 0) {
        return res.status(200).json({
          status: 'Success',
          message: 'Data retrieved successfully!',
          data: review_destinations.map((destination_review) => destination_review.toJSON()),
        });
      } else {
        console.log('Review destination not found');
        res.status(404).json({ error: 'Review adestination not found' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

const createReviewDestination = async (req, res) => {
    const { rating, comment, id_user, id_attraction } = req.body;
    try {
      const newReviewDestination = await reviewDestination.create({
        rating: rating,
        comment: comment,
        id_user: user_id,
        id_attraction: destination_id
      });
      await updateAverageRating(destination_id);
    res.status(201).json({ status: 'Success', message: 'New review has been posted!', data: newReviewDestination.toJSON() });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

// Update an attraction by ID
const updateReviewDestination = async (req, res) => {
    const id = parseInt(req.params.id);
    const { rating, comment } = req.body;
    try {
        const review_destination = await reviewDestination.findByPk(id);
        if (destination_review) {
            const updatedReviewDestination = await destination_review.update({
                rating: rating,
                comment: comment
            });
            return res.status(200).json({ status: 'Success', message: 'Review destination updated successfully', data: updatedReviewDestination.toJSON() });
        } else {
            return res.status(404).json({ message: 'Review destination not found' });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// Delete an Review destinations by ID
const deleteReviewDestination = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const review_destination = await reviewDestination.findByPk(id);
        if (review_destination) {
            await review_destination.destroy();
            return res.status(200).json({ status: 'Success', message: 'Review deleted successfully!', data: review_destination.toJSON() });
        } else {
            return res.status(404).json({ message: 'Review destination not found' });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    getAllReviewDestinations,
    getReviewDestinationById,
    getReviewDestinationByDestinationId,
    createReviewDestination,
    updateReviewDestination,
    deleteReviewDestination,
};