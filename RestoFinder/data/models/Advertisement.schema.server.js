// Will decide whether to keep it or not
// depending on time 

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AdvertisementSchema = new Schema(
  {
    advertiser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    text: String,
    posted_on: String,
    image_url: String,
    url: String
  },
  { collection: "advertisements" }
);

module.exports = AdvertisementModel = mongoose.model("Advertisement", AdvertisementSchema);
