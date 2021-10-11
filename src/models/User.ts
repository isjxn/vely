import { Document, Schema, Model, model } from 'mongoose';
import { UserRanks } from '../enums/UserRanks';

export interface IUser extends Document {
    username: string,
    password: string,
    email: string,
    rank: UserRanks
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    rank: { type: Number, required: true }
});

export const User: Model<IUser> = model<IUser>('User', userSchema);
