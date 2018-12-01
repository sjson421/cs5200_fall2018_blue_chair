const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdvertiserSchema = new Schema({
    company: {
        name: {
          type: String,
          required: true
        },
        position: String
    },
    payment: {
        credit_card_number: {
            type: String,
            required: true,
            minlength: 10,
            maxlength: 10
        },
        cardType:{
            type: String,
            enum: ["Visa", "Mastercard", "Discover"]
        },
        cvv: {
            type: String,
            minlength: 3,
            maxlength: 3,
            required: true
        }
    }

});

module.exports = AdvertiserSchema;
