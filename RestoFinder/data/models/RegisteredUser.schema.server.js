const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RegisteredUserSchema = new Schema({
  // Have various favorities list
  favourites: [
    {
      type: Schema.Types.ObjectId,
      ref: "Restaurant"
    }
  ],
  // Follows critics and registered users
  follows: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true
    }
  ],

  // Followed By only users
  followedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

module.exports = RegisteredUserSchema;
