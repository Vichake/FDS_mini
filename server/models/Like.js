const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeSchema = new Schema(
  {
    userId: { 
      type: String, 
      ref: 'User', 
      required: true, 
      unique: true // Ensures one entry per user
    },
    songIds: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Song' 
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Like', likeSchema);
