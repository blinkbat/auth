


const User = require( '../models/user' );

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
            res.json({ success: true });
        });

    });
    
}


