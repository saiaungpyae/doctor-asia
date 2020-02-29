import mongoose, { Schema } from 'mongoose';

const { ObjectId } = Schema.Types;

const schema = new Schema(
  {
    value: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('VALUE', schema);
