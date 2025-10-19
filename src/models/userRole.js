import mongoose from 'mongoose';

const userRoleSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['superuser', 'admin'],
      required: true,
      index: true,
    },
    assignedById: {
      type: String,
    },
    assignedByTag: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

userRoleSchema.index({ userId: 1, role: 1 }, { unique: true });

export default mongoose.models.UserRole ||
  mongoose.model('UserRole', userRoleSchema);
