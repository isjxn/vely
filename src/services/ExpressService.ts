import express, { Application, NextFunction, Request, Response } from 'express';
import nunjucks, { Environment } from 'nunjucks';
import bodyParser from 'body-parser';
import { indexRoute } from '../routes/indexRoute';
import DebuggerService from './DebuggerService';
import { adminRoute } from '../routes/adminRoute';
import passport from 'passport';
import { IUser, User } from '../models/User';
const LocalStrategy = require('passport-local').Strategy;
import bcrypt from 'bcrypt';
import { RecaptchaV3 } from 'express-recaptcha/dist';
import cors from 'cors';
import session from 'express-session';
import flash from 'connect-flash';
import GitHubStrategy, { Profile } from 'passport-github';
import { INewProfile } from '../interfaces/INewProfile';

export default class ExpressService {
    private debugger: DebuggerService;
    private app: Application;
    public recaptcha: RecaptchaV3;
    private nunjucksEnviroment: Environment;

    constructor() {
        this.debugger = new DebuggerService('Express');
        this.app = express();
        this.recaptcha = new RecaptchaV3(process.env.RECAPTCHA_SITE_KEY as unknown as string, process.env.RECAPTCHA_SECRET_KEY as unknown as string, { callback: 'cb'});
        this.nunjucksEnviroment = nunjucks.configure('views', {
            autoescape: true,
            express: this.app
        });
    }

    public initialize() {
        this.debugger.info('Initializing..');

        this.registerMiddlewares();
        this.registerRoutes();
        this.listen();
    }

    private registerMiddlewares() {
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.app.use(express.static('public'));
        this.app.use(cors({
            origin: process.env.HTTP_URL as unknown as string
        }));
        this.app.use(session({ 
            secret: 'velycmsnanologic',
            resave: false,
            saveUninitialized: false
        }));
        this.app.use(flash());
        this.app.use(passport.initialize());
        this.app.use(passport.session());

        this.app.use('/admin', async (req, res: Response, next: NextFunction) => {
            if (req.path != '/login' && req.path != '/register' && req.path != '/auth/github' && req.path != '/auth/github/callback') {
                if (req.session.passport) {
                    if (req.session.passport.user != undefined) {
                        const user = await User.findById(req.session.passport.user._id);
                        if (user) {
                            if (user.active) {
                                this.nunjucksEnviroment.addGlobal('username', user.username);
                                this.nunjucksEnviroment.addGlobal('rank', user.rank);
                                this.nunjucksEnviroment.addGlobal('avatar_url', user.avatar_url);

                                next();
                            } else {
                                res.redirect('/admin/login');
                            }
                        } else {
                            res.redirect('/admin/login');
                        }
                    } else {
                        res.redirect('/admin/login');
                    }
                } else {
                    res.redirect('/admin/login');
                }
            } else {
                next();
            }
        });

        passport.use(new LocalStrategy((username: string, password: string, done: Function) => {
            User.findOne({ username: username }, (err: Error, user: IUser) => {
                if (err) return done(err);

                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });    
                }

                bcrypt.compare(password, user.password, (err: Error | undefined, result: boolean) => {
                    if (err) return done(err);

                    if (result) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Incorrect password.' });
                    }
                });
            });
        }));

        passport.use(new GitHubStrategy({
                clientID: process.env.GITHUB_CLIENT_ID as unknown as string,
                clientSecret: process.env.GITHUB_CLIENT_SECRET as unknown as string,
                callbackURL: `${process.env.HTTP_URL}/admin/auth/github/callback`
            },
            async (accessToken: string, refreshToken: string, profile: Profile, cb) => {
                const user  = await User.findOne({ githubId: profile.id });

                if (user) {
                    user.githubAccessToken = accessToken;

                    user.save().then(() => {
                        return cb(null, user);
                    });
                } else {
                    const userCheckedUsername = await User.findOne({ username: profile.username });

                    if (userCheckedUsername) {
                        if (userCheckedUsername.githubId === 'UNKNOWN') {
                            return cb(null, false, { message: 'Existing Account is not connected to GitHub.\nIf you want to use GitHub authentication connect your GitHub account in your profile settings.' });
                        } else if (userCheckedUsername.githubId === 'AUTH') {
                            userCheckedUsername.githubId = profile.id;
                            userCheckedUsername.githubAccessToken = accessToken;
                            userCheckedUsername.githubUsername = profile.username as unknown as string;

                            userCheckedUsername.save().then(() => {
                                return cb(null, userCheckedUsername);
                            });
                        } else {
                            return cb(null, false, { message: 'Wow! You managed to create an error we didn\'t know could happen, please report it to: admin@nanologic.dev'});
                        }
                    } else {
                        const newProfile: INewProfile = profile as INewProfile;
                        const newUser = new User({ 
                            username: profile.username, 
                            avatar_url: newProfile._json.avatar_url ,
                            githubId: profile.id, 
                            githubAccessToken: accessToken,
                            githubUsername: profile.username
                        });

                        newUser.save().then(() => {
                            return cb(null, newUser);
                        });
                    }
                }
            }
        ));

        passport.serializeUser((user: any, done: any) => {
            done(null, user);
        });

        passport.deserializeUser(function(id: any, done: any) {
            User.findById(id, (err: Error, user: IUser) => {
              done(err, user);
            });
        });
    }

    private registerRoutes() {
        this.app.use('/', indexRoute);
        this.app.use('/admin', adminRoute);
    }

    private listen() {
        this.app.listen(process.env.HTTP_PORT, () => {
            this.debugger.info(`Listening on port: ${process.env.HTTP_PORT}`);
        });
    }
}