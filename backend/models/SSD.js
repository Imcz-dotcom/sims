const mongoose = require('mongoose');

const SSDSchema = new mongoose.Schema(
  {
    deviceId: { type: String, required: true, unique: true },
    model: { type: String, required: true },
    serialNumber: { type: String, required: true, unique: true },
    capacity: { type: String, required: true },
    interface: { type: String, required: true },
    status: { type: String, required: true, enum: ['Active', 'Available', 'Failed'] },
    location: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('SSD', SSDSchema);
