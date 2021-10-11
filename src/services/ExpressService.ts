import express, { Application } from 'express';
import nunjucks from 'nunjucks';
import { indexRoute } from '../routes/indexRoute';

export default class ExpressService {
    private app: Application;

    constructor() {
        this.app = express();
    }

    public initialize() {
        this.registerMiddlewares();
        this.registerRoutes();
        this.listen();
    }

    private registerMiddlewares() {
        this.app.use(express.static('public'));

        nunjucks.configure('views', {
            autoescape: true,
            express: this.app
        });
    }

    private registerRoutes() {
        this.app.use('/', indexRoute);
    }

    private listen() {
        this.app.listen(process.env.HTTP_PORT, () => {
            console.log(`Vely listening at port: ${process.env.HTTP_PORT}`);
        });
    }
}