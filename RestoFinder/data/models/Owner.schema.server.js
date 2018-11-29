const mongoose require('mongoose');

const Schema = mongoose.Schema;


const OwnerSchema = new Schema({
  restaurant: {
    type: Schema.Types.ObjectId,
    ref: 'restaurants'
  },
  endorse: [{
    type: Schema.Types.ObjectId,
    ref: 'endorses'
  }],
  follows: [{
    type: Schema.Types.ObjectId,
    ref: 'follows'
  }]
});

module.exports = OwnerSchema;
