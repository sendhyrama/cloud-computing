//importing modules
const {Sequelize, DataTypes} = require('sequelize')
const dotenv = require('dotenv');

dotenv.config();

//Database connection with dialect of postgres specifying the database we are using
//port for my database is 5433
//database name is discover
const sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD, 
    {
        dialect: "mysql", 
        host: process.env.DATABASE_HOST,
        dialectOptions: {
            socketPath: process.env.DATABASE_LINK
        },
    },
    
    )

//checking if connection is done
sequelize.authenticate().then(() => {
    console.log(`Database connected to discover`)
}).catch((err) => {
    console.log(err)
})

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize

//connecting to model
db.destinations = require('./destination') (sequelize, DataTypes)
db.users = require('./user') (sequelize, DataTypes)
db.cities = require('./city') (sequelize, DataTypes)
db.provinces = require('./province') (sequelize, DataTypes)
db.destination_categories = require('./destination_category') (sequelize, DataTypes)
db.destination_reviews = require('./destination_review') (sequelize, DataTypes)
db.destination_wishlists = require('./destination_wishlist') (sequelize, DataTypes)

// associate attraction
db.destination_categories.hasMany(db.destinations, { foreignKey: 'destination_category_id' })
db.destinations.belongsTo(db.destination_categories, { foreignKey: 'destination_category_id' })
db.cities.hasMany(db.destinations, { foreignKey: 'city_id' })
db.destinations.belongsTo(db.cities, { foreignKey: 'city_id' })

// db.provinces.hasMany(db.cities, { foreignKey: 'province_id' })
// db.cities.belongsTo(db.provinces, { foreignKey: 'province_id' })
// db.facilities.belongsToMany(db.attractions, {
//     through: "relation_facility_attraction",
//     as: "attractions",
//     foreignKey: "id_facility"})
// db.tour_packages.belongsToMany(db.tour_package_categories, {
//     through: "relation_tour_package_cat",
//     as: "tour_package_categories",
//     foreignKey: "id_tour_package"
// })
// db.tour_package_categories.belongsToMany(db.tour_packages, {
//     through: "relation_tour_package_cat",
//     as: "tour_packages",
//     foreignKey: "id_package_cat"})

// db.tour_packages.belongsToMany(db.tour_package_categories, { through: db.relation_tour_package_cats });
// db.tour_package_categories.belongsToMany(db.tour_packages, { through: db.relation_tour_package_cats  });

// associate destination wishlist
db.destinations.hasMany(db.destination_wishlists, { foreignKey: 'destination_id' })
db.destination_wishlists.belongsTo(db.destinations, { foreignKey: 'destination_id' })
db.users.hasMany(db.destination_wishlists, { foreignKey: 'user_id' })
db.destination_wishlists.belongsTo(db.users, { foreignKey: 'user_id' })

// associate Review Controller
db.users.hasMany(db.review_attractions, {foreignKey:'user_id'})
db.destination_reviews.belongsTo(db.users, {foreignKey: 'user_id'})
db.destinations.hasMany(db.destination_reviews, {foreignKey: 'destination_id'})
db.destination_reviews.belongsTo(db.destinations, {foreignKey: 'destination_id'})

// sync alter
db.destination_categories.sync({ alter: true })
db.destinations.sync({ alter: true })
db.cities.sync({ alter: true })
db.destination_reviews.sync({alter:true})

// db.provinces.sync({ alter: true })
db.users.sync({ alter: true })
db.destination_wishlists.sync({ alter: true })

//exporting the module
module.exports = db