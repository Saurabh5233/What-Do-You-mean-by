const mongoose  = require('mongoose');

const connectDB = async ()=>{
    await mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

    mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
    });

}

module.exports = connectDB;