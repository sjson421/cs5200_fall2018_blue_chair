const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const user = require('./routes/user');

const app = express();


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('tiny'));

const db = require('./data/db').mongoURI;

mongoose.connect(db)
        .then(conn => console.log('mongodb connected'))
        .catch(err => console.log(err));


app.get('/', (req, res) => res.send('Hello world whatsup'));
app.use('/api/users', user);

const port = process.env.PORT || 6000;

app.listen(port, () => console.log(`Server running on ${port}`));
