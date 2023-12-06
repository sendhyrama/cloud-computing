const db = require("../models");
const destination = db.destinations;
const reviewDestination = db.destination_reviews;

// Get all destinations
const getAllDestinations = async (req, res) => {
  try {
    const Destination = await destination.findAll({
      include: [db.destination_categories, db.cities],
      order: [['destination_id', 'ASC']]
    });
    return res.status(200).json({status: 'Success', message: 'Data retrieved successfully!', data: destination});
  } catch (e) {
    console.log(e);
    }
};

// Get destination by ID
const getDestinationsById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const Destination = await destination.findByPk(id, {
      include: [db.destination_categories, db.cities],
    });
    if (destination) {
      return res.status(200).json({status: 'Success', message: 'Data retrieved successfully!', data: destination.toJSON() });
    } else {
      console.log('Destination not found');
      res.status(404).json({ error: 'Destination not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getDestinationsByCategoryId = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const Destinations = await destination.findAll({
      include: [
        {
          model: db.destination_categories,
          where: { destination_category_id: id },
        },
        db.cities,
      ],
    });
    if (destinations.length > 0) {
      return res.status(200).json({
        status: 'Success',
        message: 'Data retrieved successfully!',
        data: destinations.map((destination) => destination.toJSON()),
      });
    } else {
      console.log('destinations not found');
      res.status(404).json({ error: 'destination not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new destination
const createDestination = async (req, res) => {
  const {name, price, desc, photo, address, coordinate, city_id, destination_category_id} = req.body;
  try {
    const newDestination = await destination.create({
      destination_name: name,
      destination_price: price,
      destination_desc: desc,
      destination_photo: photo,
      destination_address: address,
      destination_coordinate: coordinate,
      city_id: city_id,
      destination_category_id: destination_category_id,
    });
    res.status(201).json({ status: 'Success', message: 'New destination has been created!', data: newDestination.toJSON() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

async function calculateAverageRating(destination_id) {
  const reviews = await reviewDestination.findAll({ where: { destination_id } });
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;
  return averageRating;
}

async function updateAverageRating(destination_id) {
  const averageRating = await calculateAverageRating(destination_id);
  await destination.update({ averageRating }, { where: { id: destination_id } });
}

// Update an attraction by ID
const updateDestination = async (req, res) => {
  const id = parseInt(req.params.id);
  const {name, price, desc, photo, address, coordinate, city_id, destination_category_id} = req.body;
  try {
    const Destination = await destination.findByPk(id);
    if (destination) {
      const updatedDestination = await destination.update({
        destination_name: name,
        destination_price: price,
        destination_desc: desc,
        destination_photo: photo,
        destination_address: address,
        destination_coordinate: coordinate,
        city_id: city_id,
        destination_category_id: destination_category_id,
      });
      return res.status(200).json({ status: 'Success', message: 'Destination updated successfully', data: updatedDestination.toJSON() });
    } else {
      return res.status(404).json({ status: 'Failed', message: 'Destination not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Delete an attraction by ID
const deleteDestination = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
      const Destination = await destination.findByPk(id);
      if (destination) {
          await destination.destroy();
          return res.status(200).json({ status: 'Success', message: 'Destination deleted successfully!', data: destination.toJSON() });
      } else {
          return res.status(404).json({ status: 'Failed', message: 'Destination not found' });
      }
  } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  getAllDestinations,
  getDestinationsById,
  getDestinationsByCategoryId,
  createDestination,
  updateDestination,
  deleteDestination,
  calculateAverageRating,
  updateAverageRating
};