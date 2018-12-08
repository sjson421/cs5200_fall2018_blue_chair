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
    time_created: String,
    url: String,
    yelp_review: Boolean,
    comments: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User"
        },
        text: {
          type: String,
          required: true
        }
      }
    ]
  },
  { collection: "reviews" }
);

module.exports = ReviewModel = mongoose.model("Review", ReviewSchema);
