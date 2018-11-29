const mongoose require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  password: {
    type: String,
    required: true
  },
  address: {
    streetaddress: {
      type: String,
      required: true
    },
    streetaddress2: {
      type: String
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    zipcode: {
      type: Number,
      required: true
    }
  },
  phone: {
    type: Number,
    required: true
  },
  // can remove this field
  userType: {
    type: String
  },
  ownerSchema: {
    type: Schema.Types.ObjectId,
    ref: 'owners'
  },
  criticSchema: {
    type: Schema.Types.ObjectId,
    ref: 'critics'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model('users', UserSchema);
