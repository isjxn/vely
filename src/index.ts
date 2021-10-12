import DebuggerService from "./services/DebuggerService";
import ExpressService from "./services/ExpressService";
import MongooseService from "./services/MongooseService";

require('dotenv').config();

class Application {
    private debugger: DebuggerService;
    private mongooseService: MongooseService;
    public expressService: ExpressService;

    constructor() {
        this.debugger = new DebuggerService('Application');
        this.mongooseService = new MongooseService();
        this.expressService = new ExpressService();
    }

    public initialize() {
        this.debugger.info(`Initializing..`);

        this.mongooseService.initialize();
        this.expressService.initialize();
    }
}

const application = new Application();

application.initialize();

const expressService = application.expressService;

export { expressService };