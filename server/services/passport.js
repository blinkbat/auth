


// package dependencies
const passport      = require( 'passport' );
const JwtStrategy   = require( 'passport-jwt' ).Strategy;
const ExtractJwt    = require( 'passport-jwt' ).ExtractJwt;
const LocalStrategy = require( 'passport-local' );

// our dependencies
const User = require( '../models/user' );
const config = require( '../config' );



// create local strategy
const localLogin = new LocalStrategy(
    
    // expects username, but we'll send email instead
    { usernameField: 'email' },

    ( email, password, done ) => {

        // verify email and password and call done
        // with the user if authed. otherwise,
        // call done with false.

        User.findOne({ email: email }, ( err, foundUser ) => {

            // if error, return early w/ err
            if( err ) return done( err );

            // if no user found, return null err and false user
            if( !foundUser ) return done( null, false );

            // compare password to User.password
            foundUser.comparePassword( password, ( err, isMatch ) => {

                if( err ) return done( err );

                if( !isMatch ) return done( null, false );

                return done( null, foundUser );

            });

        });

});



// config options for JWT
const jwtOptions = {

    // extract jwt from auth header
    jwtFromRequest: ExtractJwt.fromHeader( 'authorization' ),
    
    // use our secret string from config
    secretOrKey: config.secret

};

// create JWT strategy
const jwtLogin = new JwtStrategy( 

    jwtOptions,

    function( payload, done ) {

        // see if user ID exists in db
        // if so, call done() with that user
        // else, call done() w/ no user obj
        User.findById( payload.sub, function( err, user ) {

            // if error, return the error. user is false
            if( err ) { return done( err, false ); }

            // check for user obj
            if( user ) { 
                return done( null, user ); 
            } else { 
                return done( null, false );
            }

        });
        
});

// tell passport to use this strategy   
passport.use( jwtLogin );
passport.use( localLogin );


