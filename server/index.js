


// main starting point of our app.
// let's convert this syntax to ES6 soon.
const express       = require( 'express' );
const http          = require( 'http' );
const bodyParser    = require( 'body-parser' );
const morgan        = require( 'morgan' );
const mongoose      = require( 'mongoose' );

const app = express();

const router = require( './router' );


// db setup -- creates new db called 'auth'
mongoose.connect( 
    'mongodb://localhost:auth/auth', 
    { useNewUrlParser: true } 
);



// app setup
// morgan is a logging framework
app.use( morgan( 'combined' ) );

// bodyParser lets us use json requests
app.use( bodyParser.json({ type: '*/*' }) );

router( app );


// server setup
const port      = process.env.PORT || 3090;
const server    = http.createServer( app );

server.listen( port );

console.log( 'server listening on:', port );


