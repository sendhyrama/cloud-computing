const db = require("../models");
const WishlistDestination = db.destination_wishlists;

// GET wishlist attraction by Id User
const getWishlistDestinationByUserId = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const destination_wishlists = await WishlistDestination.findAll({
        where: { user_id: id },
        include: [
          {
            model: db.users,
            attributes: ["user_fullname"]
          },
          {
            model: db.destinations,
            attributes: ["destination_name"],
          },
        ],
      });
      if (destination_wishlists.length > 0) {
        return res.status(200).json({
          status: 'Success',
          message: 'Data retrieved successfully!',
          data: destination_wishlists
        });
      } else {
        console.log('Wishlist not found');
        res.status(404).json({ error: 'Wishlist not found' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };  

// Add wishlist attraction
const createWishlistDestination = async (req, res) => {
    try {
      const { userId, destinationId } = req.body;
      if (!userId || !destinationId) {
        return res.status(400).json({ error: 'Id user and Id destination are required' });
      }
      const newWishlistDestination = await WishlistDestination.create({
        user_id: userId,
        destination_id: destinationId,
      });
      res.status(201).json({ status: 'Success', message: 'New wishlist has been created!', data: newWishlistDestination });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

// Delete an attraction by ID
const deleteWishlistDestination = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const destination_wishlists = await WishlistDestination.findByPk(id);
        if (destination_wishlists) {
            await destination.destroy();
            return res.status(200).json({ status: 'Success', message: 'Wishlist deleted successfully!', data: destination_wishlists.toJSON() });
        } else {
            return res.status(404).json({ message: 'Wishlist Attraction not found' });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = {
    getWishlistDestinationByUserId,
    createWishlistDestination,
    deleteWishlistDestination,
};
