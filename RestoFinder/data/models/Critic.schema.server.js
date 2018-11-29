const mongoose require('mongoose');

const Schema = mongoose.Schema;


const CriticSchema = new Schema({
  company: {
    name: {
      type: String,
      required: true
    }

  }
})

module.exports = Critic = mongoose.model('critics', CriticSchema)
