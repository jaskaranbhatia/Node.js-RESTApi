const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require("passport");

//bring all routes
const auth = require('./routes/api/auth');
const questions = require('./routes/api/questions');
const profile = require('./routes/api/profile');

const app = express();
//Middleware for bodyParser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const port = process.env.PORT||3000;

//mongodb Configuration
const db = require('./setup/MyURL').mongoURL;

//Connect to database(Attempt)
mongoose
    .connect(db,{ useNewUrlParser: true })
    .then(()=>{
        console.log('Mongo DB Connected');
    })
    .catch((err)=>{
        console.log(err);
    });


//Passport middleware
app.use(passport.initialize());
//Config for jwt strategy
require('./strategies/jsonwtStrategy')(passport);

/*Get Route for testing 
app.get('/',(req,res)=>{
    res.send('Hey Big-Stack');
});
*/

//Actual Routes
app.use('/api/auth',auth);
app.use('/api/questions',questions);
app.use('/api/profile',profile);


app.listen(port,()=>{
    console.log('Server running at port 3000');
});
