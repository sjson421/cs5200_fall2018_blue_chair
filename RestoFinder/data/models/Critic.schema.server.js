const mongoose require('mongoose');

const Schema = mongoose.Schema;


const CriticSchema = new Schema({
  company: {
    name: {
      type: String,
      required: true
    }
  },
  // an endorse array and follow array not sure
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'reviews'
  }],
  follows: [{
    type: Schema.Types.ObjectId,
    ref: 'follows'
  }],
  endorse: [{
    type: Schema.Types.ObjectId,
    ref: 'endorses'
  }]
})

module.exports = CriticSchema;
