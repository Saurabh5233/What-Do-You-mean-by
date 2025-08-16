// here we'll use two authentication strategies: local and Google OAuth

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User.js');

//////////////
// LocalStrategy
////////////////

passport.use(
    new LocalStrategy(
        {usernameField: 'email'},  // tells passport to use email as usernameField instead of username
        async (email, password, done)=>{
            try{
                const foundUser = await User.findOne({email});

                if(!foundUser || !(await foundUser.comparePassword(password))){
                    return done(null, false, {message: "Invalid Credentials"});
                }
                return done(null, foundUser);
            }catch (err){
                return done(err);
            }
        }
    )
);

////////////////
// GoogleStrategy
//////////////////

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/api/auth/google/callback',
        }, 

        async (accessToken, refreshToken, profile, done)=>{
            try{
                // check if user already exists....
                let user = await User.findOne({googleId: profile.id});

                if(!user){
                    user = await User.create({
                        googleId: profile.id, 
                        email: profile.emails[0].value,
                        name : profile.displayName,
                    });
                }

                return done(null, user);

            }catch(err){
                return done(err);
            }
        }
    )
);


///////////
// There's a need to serialize and Deserialize user....

passport.serializeUser((user, done)=>{
    done(null, user.id);
})

passport.deserializeUser(async (id, done)=>{
    try{
        const foundUser = await User.findById(id);
        done(null, foundUser);
    }catch(err){
        done(err);
    }
});

module.exports = passport;
