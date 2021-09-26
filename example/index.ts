import {question} from '../src/utils';
import {Tomcat} from '../src';
import path from 'path';

class Example {
    private _tomcat = new Tomcat();

    async run() {
        const info = await this._tomcat.serverInfo();
        await this.info('current tomcat server:', info);

        while (true) {
            const line = await question('example > ');
            const arr = line.trim().split(/\s+/);
            switch (arr[0]) {
                case 'info':
                    await this.serverInfo();
                    break;

                case 'list':
                    await this.list();
                    break;

                case 'deploy':
                    await this.deploy(arr[1] === 'true');
                    break;

                case 'undeploy':
                    await this.unDeploy();
                    break;

                case 'quit':
                    return;

                default:
                    this.error(`unknown command: ${arr[0]}`);
                    break;
            }
        }
    }

    private async serverInfo() {
        await this.call(() => this._tomcat.serverInfo());
    }

    private async list() {
        await this.call(() => this._tomcat.list());
    }

    private async deploy(force: boolean) {
        const file = path.join(__dirname, './example.war');
        await this.call(() => this._tomcat.deploy(file, null, force));
    }

    private async unDeploy() {
        await this.call(() => this._tomcat.unDeploy('/example'));
    }

    private call(func: () => Promise<string>) {
        return func().then(
            r => this.info(r),
            e => this.error(e)
        );
    }

    private info(...messages: string[]) {
        console.info(messages.join('\n'));
    }

    private error(...messages: string[]) {
        console.error(messages.join('\n'));
    }
}

new Example().run().then();

