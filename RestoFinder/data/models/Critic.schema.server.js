const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//  can potenially add rating of critic by registered users
const CriticSchema = new Schema({
  company: {
    name: {
      type: String,
      required: true
    },
    position: String
  },

  // Follows another critics which are type of user
  // have to do validation from outside/frontend?
  follows: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  // All users which follows this critic(many to many)
  // have to do validation
  followedBy: [

    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  // Endorses owner which are type of User
  // have to do some validation
  // whenever there is a endorse in
  endorses: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

module.exports = CriticSchema;
