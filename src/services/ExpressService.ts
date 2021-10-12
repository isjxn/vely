import express, { Application, NextFunction, Request, Response } from 'express';
import nunjucks from 'nunjucks';
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

export default class ExpressService {
    private debugger: DebuggerService;
    private app: Application;
    public recaptcha: RecaptchaV3;

    constructor() {
        this.debugger = new DebuggerService('Express');
        this.app = express();
        this.recaptcha = new RecaptchaV3(process.env.RECAPTCHA_SITE_KEY as unknown as string, process.env.RECAPTCHA_SECRET_KEY as unknown as string, { callback: 'cb'});
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
            origin: process.env.CORS_URL as unknown as string
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
            console.log(req.path);
            if (req.path != '/login' && req.path != '/register') {
                if (req.session.passport) {
                    const user = await User.findById(req.session);

                    if (user) {
                        if (user.active) {
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
                next();
            }
        });

        nunjucks.configure('views', {
            autoescape: true,
            express: this.app
        });
        
        passport.use(new LocalStrategy((username: string, password: string, done: Function) => {
            User.findOne({ username: username }, (err: Error, user: IUser) => {
                if (err) return done(err);
                
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });    
                }
                
                bcrypt.compare(password, user.password, (err, result) => {
                    if (err) return done(err);

                    if (result) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Incorrect password.' });
                    }
                });
            });
        }));

        passport.serializeUser((user, done) => {
            done(null, user);
          });
          
        passport.deserializeUser(function(id, done) {
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