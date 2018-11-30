const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const OwnerSchema = require("./Owner.schema.server");
const CriticSchema = require("./Critic.schema.server");
const RegisteredUserScehma = require("./RegisteredUser.schema.server");

const UserSchema = new Schema(
  {
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
    // Add enum in userType
    userType: {
      type: String,
      required: true,
      enum: ["REGISTERED", "CRITIC", "OWNER"]
    },
    owner: OwnerSchema,
    critic: CriticSchema,
    RegisteredUser: RegisteredUserScehma,
    date: {
      type: Date,
      default: Date.now
    }
  },
  { collection: "users" }
);

module.exports = User = mongoose.model("User", UserSchema);
