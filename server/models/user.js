


// dependencies
const mongoose = require( 'mongoose' );
// pull Schema off mongoose
const Schema = mongoose.Schema;

// require bcrypt for encryption
const bcrypt = require( 'bcrypt-nodejs' );

// define our model
const userSchema = new Schema({

    email: { 
        type: String,
        // value must be unique in db
        unique: true, 
        // enforce lowercase because mongo
        // unique check is case-sensitive
        lowercase: true
    },

    password: String

});

// on Save Hook, encrypt password
// before saving, run this func
userSchema.pre( 'save', function( next ) {

    // get access to User model
    const user = this;

    // generate a salt, then callback
    bcrypt.genSalt( 10, function( err, salt ) { 

        // salt err handling
        if( err ) { return next( err ); }

        // generate a hash with our salt, then callback
        bcrypt.hash( user.password, salt, null, function( err, hash ) {

            // hash err handling
            if( err ) { return next( err ); }

            // overwrite text pw with successful hash (encrypted pw) 
            user.password = hash;

            // call next
            next();

        });

    });

});



userSchema.methods.comparePassword = function( candidatePw, callback ) {

    // compare candidate hashed pw with stored hashed pw
    bcrypt.compare( candidatePw, this.password, ( err, isMatch ) => { 

        if( err ) return callback( err );

        callback( null, isMatch );

    });

};



// create Model class
const ModelClass = mongoose.model( 'user', userSchema );

// export the ModelClass
module.exports = ModelClass;


