import IRegisterUser from "../interfaces/IRegisterUser";
import { User, IUser } from '../models/User';
import bcrypt from 'bcrypt';
import { UserRank } from "../enums/UserRank";

export const registerUser = async (registerUserObject: IRegisterUser, callback: Function) => {
    if (registerUserObject.password === registerUserObject.passwordRepeat) {
        if (registerUserObject.username.length > 0) {
            if (registerUserObject.email.length > 4 && registerUserObject.email.includes('@') && registerUserObject.email.includes('.')) {
                if (registerUserObject.password.length > 0) {
                    if (registerUserObject.passwordRepeat.length > 0) {
                        const searchUser = await User.findOne({ username: registerUserObject.username });

                        if (searchUser) {
                            callback(false, `Username has already been taken`);
                        } else {
                            const hash: string = await bcrypt.hash(registerUserObject.password, 10)

                            if (hash) {
                                const user: IUser = new User({
                                    username: registerUserObject.username,
                                    email: registerUserObject.email,
                                    password: hash,
                                    rank: UserRank.User
                                });

                                user.save().then(() => callback(true, null, user));
                            } else {
                                callback(false, 'An internal error occured');
                            }
                        }
                    } else {
                        callback(false, 'Repeat Password can\'t be empty');
                    }
                } else {
                    callback(false, 'Please enter a password');
                }
            } else {
                callback(false, 'Please enter a valid email');
            }
        } else {
            callback(false, 'Please enter a username');
        }
    } else {
        callback(false, 'Passwords don\'t match!');
    }
}