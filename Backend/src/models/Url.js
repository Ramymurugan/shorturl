const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: [true, 'Please add the original destination URL']
    },
    shortCode: {
      type: String,
      unique: true,
      required: true,
      index: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    qrCode: {
      type: String
    },
    isActive: {
      type: Boolean,
      default: true
    },
    clicks: {
      type: Number,
      default: 0
    },
    expiresAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Url', UrlSchema);
