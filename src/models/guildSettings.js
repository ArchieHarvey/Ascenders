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
    logging: {
      channelId: {
        type: String,
        default: null,
      },
      enabled: {
        type: Boolean,
        default: false,
      },
      events: {
        member: {
          type: Boolean,
          default: true,
        },
        role: {
          type: Boolean,
          default: true,
        },
        channel: {
          type: Boolean,
          default: true,
        },
        thread: {
          type: Boolean,
          default: true,
        },
        message: {
          type: Boolean,
          default: true,
        },
        audit: {
          type: Boolean,
          default: true,
        },
      },
      updatedById: {
        type: String,
        default: null,
      },
      updatedByTag: {
        type: String,
        default: null,
      },
      updatedAt: {
        type: Date,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.GuildSettings ||
  mongoose.model('GuildSettings', guildSettingsSchema);
