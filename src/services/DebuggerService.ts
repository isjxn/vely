import chalk from 'chalk';

export default class DebuggerService {
    private serviceName: string;

    constructor(_serviceName: string) {
        this.serviceName = _serviceName;
    }

    public info(_message: string): void {
        console.info(chalk.blue(`[${this.serviceName}-INFO]: `) + chalk.blueBright(`${_message}`));
    }

    public warn(_message: string): void {
        console.warn(chalk.yellow(`[${this.serviceName}-WARN]: `) + chalk.yellowBright(`${_message}`));
    }

    public error(_message: string): void {
        console.error(chalk.red(`[${this.serviceName}-ERROR]: `) + chalk.redBright(`${_message}`));
    }

}