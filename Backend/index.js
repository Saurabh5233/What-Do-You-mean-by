require("dotenv").config();
const express = require("express");
const cors = require('cors');
const session = require('express-session');
const connectDB= require('./config/db');
const passport = require("./config/passport");
const authRoutes = require("./routes/auth");
const wordRoutes = require("./routes/words");
const feedbackRoutes = require("./routes/feedback");

const app = express();
app.use(express.urlencoded({ extended: true })); // to parse URL-encoded bodies

connectDB(); // this connects to the database

app.use(express.json()); // it's a middleware to parse incoming JSON requests

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false , 
    cookie:{
        maxAge: 1000 * 60 * 60 * 24 * 30 
    }  
}));

app.use(passport.initialize()); // this starts the passport
app.use(passport.session()); // for persistent login sessions

app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:3000', 'http://localhost:5173', 'http://localhost:8081' ];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/words', wordRoutes);
app.use('/api/feedback', feedbackRoutes);
app.get('/', (req, res)=> res.send('API Running'));


const PORT = 3030;
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})
