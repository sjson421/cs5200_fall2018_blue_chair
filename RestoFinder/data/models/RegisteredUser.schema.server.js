const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const RegisteredUserSchema = new Schema({
  favouritesList: {
    name: {
      type: String,
      required: true
    },
    restaurants: [{
      type: Schema.Types.ObjectId,
      ref: 'restaurants'
    }]
  },
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'reviews'
  }],
  // not sure of this
  follows: [{
    type: Schema.Types.ObjectId,
    ref: 'follows'
  }]
});


module.exports = RegisteredUserSchema;
