const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const users = require('./data/daos/user.daos.server');

const app = express();


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const db = require('./data/db').mongoURI;

mongoose.connect(db)
        .then(conn => console.log('mongodb connected'))
        .catch(err => console.log(err));


app.get('/', (req, res) => res.send('Hello world whatsup'));
app.use('/api/users', users);

const port = process.env.PORT || 6000;

app.listen(port, () => console.log(`Server running on ${port}`));
