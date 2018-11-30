const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ReviewSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true
    },
    rating: Number,
    text: String,
    time_create: String,
    url: String
  },
  { collection: "reviews" }
);

module.exports.Review = mongoose.model("Review", ReviewSchema);
