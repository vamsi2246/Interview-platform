import { Request } from 'express';
import { IUser } from './IUser.js';

export interface AuthRequest extends Request {
  user?: IUser;
  auth?: () => { userId: string | null }; // from @clerk/express
}
