require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connection = require("./db");
const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();
const PORT = process.env.PORT || 8080;

// database connection
connection();

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
	res.locals.path = req.path;
	next();
});

// routes

app.use("/api/rooms", roomRoutes);

// Booking Route
app.use("/api/bookings", bookingRoutes);

const root = require('path').join(__dirname, 'frontend', 'build')
app.use(express.static(root));

app.get("*", (req, res) => {
  res.sendFile('index.html', { root });
})



// listening on port
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
