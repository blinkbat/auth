


const passport = require( 'passport' );

const Authentication = require( './controllers/authentication' );
const passportService = require( './services/passport' );



// passport auth with jwt strategy, don't use cookies
const requireAuth = passport.authenticate( 'jwt', { session: false } );
// passport auth with local strategy
const requireSignIn = passport.authenticate( 'local', { session: false } );

module.exports = app => {

    // any request must pass requireAuth
    // first arg: route, second arg: auth flow
    // third arg: content of route
    app.get( '/', requireAuth, ( req, res ) => {

        res.send({ hi: 'there' });

    });

    // for signup route, use auth controller's signup method
    app.post( '/signup', Authentication.signUp );

    // for signin route, must pass requireSignIn
    app.post( '/signin', requireSignIn, Authentication.signIn );

}


