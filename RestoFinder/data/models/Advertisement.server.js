// Will decide whether to keep it or not
// depending on time 

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AdvertisementSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    text: String,
    time_create: String,
    url: String
  },
  { collection: "advertisements" }
);

module.exports.Advertisement = mongoose.model("Advertisement", AdvertisementSchema);
