const User = require('../models/User');
const jwt = require('jsonwebtoken');


const register = async (req, res)=>{
    try{
        const{email, password, name} = req.body;
        const user = await User.create({
            email, password, name,
        });

        const {password: pw, ...userData} = user.toObject();
        res.status(201).json({ message: 'User registered successfully', user: userData });

    }catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}



const login = async (req, res)=>{
    try{
        const {email, password} = req.body;
        
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        
        const user = await User.findOne({ email });
        
        // Check if user exists and password matches
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        // Send successful response
        res.status(200).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });

    }catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}



const logout = (req, res)=>{
    req.logout(function(err){
        if(err){
            return res.status(500).json({ message: 'Logout failed' });
        }

        req.session.destroy((err)=>{
            res.clearCookie('connect.sid');
            res.json({message: 'Logged out successfully'})
        });
    });
}

const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

const googleCallback = async(req, res)=>{
    // At this point, Passport Google strategy has already attached user to req.user
    const token = jwt.sign(
        {id: req.user._id}, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
    );

    res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/auth/callback?token=${token}`);
}


module.exports = {
    login, register, logout, googleCallback, getMe
};