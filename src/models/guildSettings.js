import mongoose from 'mongoose';

const guildSettingsSchema = new mongoose.Schema(
  {
    guildId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    prefix: {
      type: String,
      trim: true,
      maxlength: 15,
    },
    updatedById: {
      type: String,
    },
    updatedByTag: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.GuildSettings ||
  mongoose.model('GuildSettings', guildSettingsSchema);

