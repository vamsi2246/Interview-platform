import { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  profileImage: string;
  clerkId: string;
  createdAt: Date;
  updatedAt: Date;
}
