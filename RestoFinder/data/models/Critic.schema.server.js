const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//  can potenially add rating of critic by registered users
const CriticSchema = new Schema({
  company: {
    name: {
      type: String,
      required: true
    },
    postion: String
  },

  // Follows another critics which are type of user
  // have to do validation from outside/frontend?
  follows: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  // Endorses owner which are type of User
  // have to do some validation
  endorse: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

module.exports = CriticSchema;