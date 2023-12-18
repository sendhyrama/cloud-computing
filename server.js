//importing modules
const express = require('express')
const dotenv = require('dotenv').config()
const cookieParser = require('cookie-parser')
const session = require('express-session');
const cors = require('cors')
const sequelize = require('sequelize')
const db = require('./models')
const userRoutes = require ('./routes/userRoutes')
const destinationRoutes = require ('./routes/destinationRoutes')
const destinationWishlistRoutes = require ('./routes/destinationWishlistRoutes')
const reviewDestinationRoutes = require ('./routes/reviewDestinationRoutes')
const passport = require('passport');

//setting up your port
const PORT = process.env.PORT || 8080

// const PORT = 5000

//assigning the variable app to express
const app = express()

//synchronizing the database and forcing it to false so we dont lose data
db.sequelize.sync({ force: false }).then(() => {
    console.log("db has been re sync")
})

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

//middleware
app.use(express.json())
app.use(cors({ credentials:true, origin:'http://localhost:3000' }));
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())


//routes for the user API
app.use(userRoutes)
app.use(destinationRoutes)
app.use(destinationWishlistRoutes)
app.use(reviewDestinationRoutes)

//listening to server connection
app.listen(PORT, () => console.log(`Server is connected on ${PORT}`))