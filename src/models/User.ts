import { Document, Schema, Model, model } from 'mongoose';
import { UserRank } from '../enums/UserRank';

export interface IUser extends Document {
    username: string,
    password: string,
    email: string,
    rank: UserRank,
    active: boolean,
    avatar_url: string,
    githubId: string,
    githubAccessToken: string,
    githubUsername: string
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true, default: 'UNKNOWN' },
    password: { type: String, required: true, default: 'UNKNOWN' },
    email: { type: String, required: true, default: 'UNKNOWN' },
    rank: { type: Number, required: true, default: UserRank.User },
    active: { type: Boolean, required: true, default: false },
    avatar_url: { type: String, required: false, default: 'https://github.com/octocat.png' },
    githubId: { type: String, required: false, default: 'UNKNOWN' },
    githubAccessToken: { type: String, required: false, default: 'UNKNOWN' },
    githubUsername: { type: String, required: false, default: 'UNKNOWN' },
});

export const User: Model<IUser> = model<IUser>('User', userSchema);