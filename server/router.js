


const Authentication = require( './controllers/authentication' );


module.exports = app => {

    app.get( '/', ( req, res, next ) => res.send( "<h1>hi there root</h1>" ) );

    app.post( '/signup', Authentication.signUp );

}


