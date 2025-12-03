import mongoose, { Schema, Document } from 'mongoose';

export interface ICV extends Document {
  title: string;
  userId: mongoose.Types.ObjectId;
  templateId?: mongoose.Types.ObjectId;
  content: any;
  isPublic: boolean;
  shareableLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CVSchema = new Schema<ICV>(
  {
    title: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    templateId: { type: Schema.Types.ObjectId, ref: 'Template' },
    content: { type: Schema.Types.Mixed, required: true },
    isPublic: { type: Boolean, default: false },
    shareableLink: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

export default mongoose.models.CV || mongoose.model<ICV>('CV', CVSchema);
