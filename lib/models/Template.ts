import mongoose, { Schema, Document } from 'mongoose';

export interface ITemplate extends Document {
  name: string;
  description: string;
  thumbnail: string;
  structure: any;
  category: string;
  isPremium: boolean;
  isApproved: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TemplateSchema = new Schema<ITemplate>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
    structure: { type: Schema.Types.Mixed, required: true },
    category: { type: String, required: true },
    isPremium: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Template || mongoose.model<ITemplate>('Template', TemplateSchema);
