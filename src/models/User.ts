import { Document, Schema, Model, model } from 'mongoose';
import { UserRank } from '../enums/UserRank';

export interface IUser extends Document {
    username: string,
    password: string,
    email: string,
    rank: UserRank,
    active: boolean
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    rank: { type: Number, required: true, default: UserRank.User },
    active: { type: Boolean, required: true, default: false }
});

export const User: Model<IUser> = model<IUser>('User', userSchema);
