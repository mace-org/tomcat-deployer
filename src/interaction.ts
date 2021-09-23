import * as readline from 'readline';

export default class {
    private _rl?: readline.Interface;

    constructor() {
    }

    get interface() {
        if (!this._rl) {
            this._rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
        }
        return this._rl;
    }

    async question(query: string) {
        return new Promise<string>((resolve, reject) => {
            this.interface.question(query, resolve);
        });
    }

    close() {
        this._rl?.close();
    }

    async info(message?: any, ...optionalParams: any[]) {
        console.info(message, ...optionalParams);
        await new Promise((resolve) => {
            setTimeout(resolve, 500);
        });
    }

    async error(message?: any, ...optionalParams: any[]) {
        console.error(message, ...optionalParams);
        await new Promise((resolve) => {
            setTimeout(resolve, 500);
        });
    }
}