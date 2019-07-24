const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const user = require('./routes/user');
const restaurant = require('./routes/restaurant');
const featured = require('./routes/featured');
const event = require('./routes/event');
const advertisement = require('./routes/advertisement');
const review = require('./routes/review');
const app = express();


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('tiny'));

const db = require('./data/db').mongoURI;

mongoose.connect(db)
        .then(conn => console.log('mongodb connected'))
        .catch(err => console.log(err));


app.use(express.static(__dirname + '/public'));
app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        next();
});

app.use('/api/user', user);
app.use('/api/restaurant', restaurant);
app.use('/api/event', event);
app.use('/api/review',review);
app.use('/api/advertisement', advertisement);
app.use('/api/featured', featured);
const port = process.env.PORT || 5105;

app.listen(port, () => console.log(`Server running on ${port}`));
