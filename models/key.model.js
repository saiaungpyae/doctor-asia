import mongoose, { Schema } from 'mongoose';

const { ObjectId } = Schema.Types;

const schema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true
    },
    values: [
      {
        type: ObjectId,
        ref: 'VALUE'
      }
    ]
  },
  {
    timestamps: true
  }
);

schema.index({ key: 1 });

export default mongoose.model('KEY', schema);
