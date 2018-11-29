const mongoose require('mongoose');

const Schema = mongoose.Schema;

const OwnerSchema = new Schema({
  restaurant: {
    type: Schema.Types.ObjectId,
    ref: 'restaurants'
  }
})

module.exports = Owner = mongoose.model('owners', OwnerSchema);
