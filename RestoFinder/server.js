const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const user = require('./routes/user');
const restaurant = require('./routes/restaurant');
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
//app.get('/', (req, res) => res.send('Hello world whatsup'));
app.use('/api/user', user);
app.use('/api/restaurant', restaurant);
app.use('/api/event', event);
app.use('/api/review',review);
app.use('/api/advertisement', advertisement);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on ${port}`));
