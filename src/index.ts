import * as http from 'http';
import * as  stream from 'stream';
import Interaction from './interaction';
import * as  fs from 'fs';
import * as  path from 'path';

type TomcatOptions = {
    /** tomcat url */
    url?: string
    /** tomcat 管理用户名 */
    user?: string
    /** tomcat 管理密码 */
    password?: string
    /** 对话模式，如果 url、user、password 无效时询问用户输入正确的信息 */
    interactiveMode: true
} | {
    /** tomcat url */
    url: string
    /** tomcat 管理用户名 */
    user: string
    /** tomcat 管理密码 */
    password: string
    /** 非对话模式，如果 url、user、password 无效时抛出异常 */
    interactiveMode: false
}

export class Tomcat {
    private readonly _opts: http.RequestOptions;
    private readonly _interactiveMode: boolean;

    constructor(opts: TomcatOptions = {interactiveMode: true}) {
        this._opts = {};
        this._interactiveMode = opts.interactiveMode;
        if (opts.url) {
            this.setUrl(opts.url);
        }
        if (opts.user) {
            this.setAuth(opts.user, opts.password);
        }
        if (!this._interactiveMode && (!this._opts.hostname || !this._opts.auth)) {
            throw new Error('非对话模式需要提供有效的 url 及 user、password 值！');
        }
    }

    /**
     * 设置 tomcat url，返回 boolean 表示是否设置（是否变化）
     * @param url
     */
    setUrl(url: string) {
        if (!url) {
            return false;
        }
        const arr = /^\s*(https?:\/\/)?([^\s:\/]+)(:\d+)?\s*$/i.exec(url);
        if (!arr) {
            return false;
        }
        const protocol = arr[1] ? arr[1].slice(0, -2) : 'http:';
        const hostname = arr[2];
        const port = arr[3] ? arr[3].slice(1) : '8080';
        if (this._opts.protocol === protocol && this._opts.hostname === hostname && this._opts.port === port) {
            return false;
        }
        this._opts.protocol = protocol;
        this._opts.hostname = hostname;
        this._opts.port = port;
        return true;
    }

    /**
     * 设置 tomcat 管理用户及密码，返回 boolean 表示是否设置（是否变化）
     * @param user
     * @param pass
     */
    setAuth(user: string, pass: string = '') {
        if (!user) {
            if ('auth' in this._opts) {
                delete this._opts.auth;
                return true;
            }
        } else {
            const auth = `${user}:${pass}`;
            if (this._opts.auth !== auth) {
                this._opts.auth = auth;
                return true;
            }
        }
        return false;
    }

    /**
     * 获取 tomcat 服务器信息
     */
    async serverInfo(): Promise<string> {
        return await this.request(`/manager/text/serverinfo`);
    }

    /**
     * 获取 tomcat 当前部署的站点
     */
    async list(): Promise<string> {
        return await this.request(`/manager/text/list`);
    }

    /**
     * 部署 war 包，返回部署成功的结果
     * @param warFile
     * @param contextPath
     * 未指定时，如果 warFile 为文件路径时使用 warFile 文件名作为 contextPath
     * @param force
     * 是否强制部署，如果 contextPath 存在则强制替换
     */
    async deploy(warFile: string | stream.Readable, contextPath?: string | null, force: boolean = true): Promise<string> {
        if (!warFile) {
            throw new Error('warFile 参数不能为空！');
        }

        let getBody: () => stream.Readable;
        let stream: fs.ReadStream | undefined;

        if (typeof warFile === 'string') {
            if (!fs.existsSync(warFile)) {
                throw new Error(`文件“${warFile}”不存在！`);
            }
            const ext = path.extname(warFile);
            if (ext?.toLowerCase() !== '.war') {
                throw new Error(`文件“${warFile}”不是有效的 war 包！`);
            }
            if (!contextPath) {
                const name = path.basename(warFile);
                contextPath = name.substr(0, name.length - ext.length);
            }
            getBody = () => {
                if (stream) {
                    stream.close();
                }
                stream = fs.createReadStream(warFile);
                return stream;
            };
        } else {
            if (!contextPath) {
                throw new Error('contextPath 参数不能为空！');
            }
            getBody = () => warFile;
        }

        try {
            return await this.request(`/manager/text/deploy?path=/${contextPath}&update=${force}`, getBody);
        } finally {
            stream?.close();
        }
    }

    /**
     * 删除部署站点
     * @param contextPath
     */
    async unDeploy(contextPath: string): Promise<string> {
        if (!contextPath) {
            throw new Error('contextPath 参数不能为空！');
        }
        return await this.request(`/manager/text/undeploy?path=${contextPath}`);
    }

    /**
     * 实际的 http 请求，返回的 code 说明：
     * -2：请求过程异常或返回内容无效
     * -1：未认证
     *  0：处理成功，返回 OK - XXXX
     *  1：处理失败，返回 FAIL - XXXX
     * @param path
     * @param getBody
     */
    private async http(path: string, getBody?: () => stream.Readable) {
        const opts = {...this._opts, method: getBody ? 'put' : 'get', path};
        return new Promise<{ code: number, data?: any }>((resolve, reject) => {
            const error = (err: Error) => resolve({code: -2, data: err});
            const req = http.request(opts, res => {
                const sb: string[] = [];
                res.setEncoding('utf8')
                    .on('data', chunk => sb.push(chunk))
                    .on('error', error)
                    .on('end', () => {
                        if (res.statusCode === 401) {
                            resolve({code: -1});
                        } else {
                            const arr = /^(\S+)\s*-\s*(.+)$/s.exec(sb.join(''));
                            if (!arr) {
                                error(new Error('invalid tomcat service !'));
                            } else if (arr[1] === 'OK') {
                                resolve({code: 0, data: arr[2]});
                            } else {
                                resolve({code: 1, data: arr[2]});
                            }
                        }
                    });
            });
            req.on('error', error);
            getBody ? getBody().pipe(req, {end: true}) : req.end();
        });
    }

    /**
     * http 请求包装，检查 url、user、password 是否有效
     * @param path
     * @param getBody
     */
    private async normalRequest(path: string, getBody?: () => stream.Readable) {
        if (!this._opts.hostname) {
            throw new Error('invalid tomcat url !');
        }
        if (!this._opts.auth) {
            throw new Error('invalid tomcat user !');
        }
        const result = await this.http(path, getBody);
        if (result.code) {
            throw (result.data instanceof Error ? result.data : new Error(result.data));
        }
        return result.data;
    }

    /**
     * http 对话模式请求包装，如果请求失败尝试获取用户输入后重新请求
     * @param path
     * @param getBody
     */
    private async interactiveRequest(path: string, getBody?: () => stream.Readable) {
        const interaction = new Interaction();
        try {
            while (true) {
                if (!this._opts.hostname) {
                    const url = await interaction.question('请输入 tomcat 部署地址：');
                    if (!this.setUrl(url) || !this._opts.hostname) {
                        url && await interaction.error(`tomcat 部署地址“${url}”无效！`);
                        continue;
                    }
                }
                if (!this._opts.auth) {
                    const user = await interaction.question('请输入用户名：');
                    if (!user) {
                        continue;
                    }
                    const pass = await interaction.question('请输入密码：');
                    if (!this.setAuth(user, pass) || !this._opts.auth) {
                        await interaction.error(`用户名“${user}”密码无效！`);
                        continue;
                    }
                }
                const result = await this.http(path, getBody);
                if (result.code === -2) {
                    delete this._opts.hostname;
                    delete this._opts.protocol;
                    delete this._opts.port;
                } else if (result.code === -1) {
                    delete this._opts.auth;
                } else {
                    if (result.code) {
                        throw (result.data instanceof Error ? result.data : new Error(result.data));
                    }
                    return result.data;
                }
            }
        } finally {
            interaction.close();
        }
    }

    /**
     * 统一请求入口
     * @param path
     * @param getBody
     */
    private request(path: string, getBody?: () => stream.Readable) {
        return this._interactiveMode ? this.interactiveRequest(path, getBody) : this.normalRequest(path, getBody);
    }
}