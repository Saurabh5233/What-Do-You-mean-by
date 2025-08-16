require("dotenv").config();
const express = require("express");
const cors = require('cors');
const session = require('express-session');
const connectDB= require('./config/db');
const passport = require("./config/passport");
const authRoutes = require("./routes/auth");

const app = express();
app.use(express.urlencoded({ extended: true })); // to parse URL-encoded bodies

connectDB(); // this connects to the database

app.use(express.json()); // it's a middleware to parse incoming JSON requests

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false   
}));

app.use(passport.initialize()); // this starts the passport
app.use(passport.session()); // for persistent login sessions

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use('/api/auth', authRoutes);
app.get('/', (req, res)=> res.send('API Running'));

const PORT = 3030;
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})