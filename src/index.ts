import ExpressService from "./services/ExpressService";

class Application {
    private expressService: ExpressService;

    constructor() {
        this.expressService = new ExpressService();
    }

    public initialize() {
        require('dotenv').config();

        this.expressService.initialize();
    }
}

const application = new Application();

application.initialize();