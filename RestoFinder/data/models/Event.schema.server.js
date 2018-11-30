const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant"
    },
    start_time: String,
    end_time: String,
    date: Schema.Types.Date,
    description: String,
    price: {
      type: Number,
      required: true
    },
    ages: String
  },
  { collection: "events" }
);

module.exports = EventModel = mongoose.model("Event", EventSchema);
