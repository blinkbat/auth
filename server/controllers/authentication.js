


// import json web token
const jwt = require( 'jwt-simple' );

// import User model
const User = require( '../models/user' );

// import config obj
const config = require( '../config' );



// function to create token
function tokenForUser( user ) {

    // as convention, JWTs have a sub prop ('subject')
    // and iat ('issued at time')

    const timestamp = new Date().getTime();

    return jwt.encode( 

        { 
            sub: user.id,
            iat: timestamp 
        }, 

        // encode with our secret string
        config.secret 

    );

}



exports.signUp = ( req, res, next ) => {

    const email     = req.body.email;
    const password  = req.body.password;

    // check if given email exists
    User.findOne({ email: email }, ( err, existingUser ) => {

        // db failure handling
        if( err ) { return next(err); }

        // make sure post body has email and pw
        if( !email || !password ) {
            return res
                .status( 422 )
                .send({ error: 'You need both an email & password.' });
        }

        // if existing email found...
        if( existingUser ) {
            // send 422 status (unprocessed entity) & error msg
            return res
                .status( 422 )
                .send({ error: 'Email is in use!' });
        }

        // if email doesn't exist, create user
        const user = new User({
            email: email,
            password: password
        });

        user.save( err => {
            // save failure handling
            if( err ) { return next( err ); }

            // send success response
            res.json({ token: tokenForUser( user ) });
        });

    });
    
}



exports.signIn = ( req, res, next ) => {

    // user has signed in, give them a token
    res.send({ token: tokenForUser( req.user ) });

};


