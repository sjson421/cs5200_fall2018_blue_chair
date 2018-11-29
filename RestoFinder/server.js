const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');


const app = express();

const db = require('./data/db').mongoURI;

mongoose.connect(db)
        .then(conn => console.log('mongodb connected'))
        .catch(err => console.log(err));

const port = process.env.PORT || 6000;

app.listen(port, () => console.log(`Server running on ${port}`));
