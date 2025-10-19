import mongoose from 'mongoose';

const botStatusSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      default: 'Ready to serve!',
      trim: true,
      maxlength: 120,
    },
    activityType: {
      type: String,
      enum: ['PLAYING', 'WATCHING', 'LISTENING', 'COMPETING'],
      default: 'LISTENING',
    },
    lastUpdatedById: {
      type: String,
    },
    lastUpdatedByTag: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.BotStatus ||
  mongoose.model('BotStatus', botStatusSchema);
