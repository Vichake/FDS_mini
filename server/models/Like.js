const mongoose = require('mongoose');
const schema = mongoose.Schema;

const likeSchema = new schema({
  userId: { type: schema.Types.ObjectId, required: true },
  songId: { type: schema.Types.ObjectId, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Like', likeSchema);