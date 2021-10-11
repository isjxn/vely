import express, { Application } from 'express';
import nunjucks from 'nunjucks';
import bodyParser from 'body-parser';
import { indexRoute } from '../routes/indexRoute';
import DebuggerService from './DebuggerService';
import { adminRoute } from '../routes/adminRoute';
import passport from 'passport';
import { IUser, User } from '../models/User';
const LocalStrategy = require('passport-local').Strategy;
import bcrypt from 'bcrypt';

export default class ExpressService {
    private debugger: DebuggerService;
    private app: Application;

    constructor() {
        this.debugger = new DebuggerService('Express');
        this.app = express();
    }

    public initialize() {
        this.debugger.info('Initializing..');

        this.registerMiddlewares();
        this.registerRoutes();
        this.listen();
    }

    private registerMiddlewares() {
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
        this.app.use(express.static('public'));

        nunjucks.configure('views', {
            autoescape: true,
            express: this.app
        });

        passport.use(new LocalStrategy((username: string, password: string, done: Function) => {
            User.findOne({ username: username }, (err: Error, user: IUser) => {
                if (err) return done(err);
                
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.'});    
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