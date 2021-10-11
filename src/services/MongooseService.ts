import mongoose, { Connection } from 'mongoose';

export default class MongooseService {

    constructor() {
        mongoose.connect(process.env.MONGODB_URL as unknown as string);
    }

    public initialize() {
    }

    private registerModels() {
    }
}