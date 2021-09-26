/// <reference types="node" />
declare module "utils" {
    export function question(query: string): Promise<string>;
}
declare module "index" {
    import * as stream from 'stream';
    type TomcatOptions = {
        /** tomcat url */
        url?: string;
        /** tomcat 管理用户名 */
        user?: string;
        /** tomcat 管理密码 */
        password?: string;
        /** 对话模式，如果 url、user、password 无效时询问用户输入正确的信息 */
        interactiveMode: true;
    } | {
        /** tomcat url */
        url: string;
        /** tomcat 管理用户名 */
        user: string;
        /** tomcat 管理密码 */
        password: string;
        /** 非对话模式，如果 url、user、password 无效时抛出异常 */
        interactiveMode: false;
    };
    export class Tomcat {
        private readonly _opts;
        private readonly _interactiveMode;
        constructor(opts?: TomcatOptions);
        /**
         * 设置 tomcat url，返回 boolean 表示是否设置（是否变化）
         * @param url
         */
        setUrl(url: string): boolean;
        /**
         * 设置 tomcat 管理用户及密码，返回 boolean 表示是否设置（是否变化）
         * @param user
         * @param pass
         */
        setAuth(user: string, pass?: string): boolean;
        /**
         * 获取 tomcat 服务器信息
         */
        serverInfo(): Promise<string>;
        /**
         * 获取 tomcat 当前部署的站点
         */
        list(): Promise<string>;
        /**
         * 部署 war 包，返回部署成功的结果
         * @param warFile
         * @param contextPath
         * 未指定时，如果 warFile 为文件路径时使用 warFile 文件名作为 contextPath
         * @param force
         * 是否强制部署，如果 contextPath 存在则强制替换
         */
        deploy(warFile: string | stream.Readable, contextPath?: string | null, force?: boolean): Promise<string>;
        /**
         * 删除部署站点
         * @param contextPath
         */
        unDeploy(contextPath: string): Promise<string>;
        private checkContextPath;
        /**
         * 实际的 http 请求，返回的 code 说明：
         * -2：请求过程异常或返回内容无效
         * -1：未认证
         *  0：处理成功，返回 OK - XXXX
         *  1：处理失败，返回 FAIL - XXXX
         * @param path
         * @param getBody
         */
        private http;
        /**
         * http 请求包装，检查 url、user、password 是否有效
         * @param path
         * @param getBody
         */
        private normalRequest;
        /**
         * http 对话模式请求包装，如果请求失败尝试获取用户输入后重新请求
         * @param path
         * @param getBody
         */
        private interactiveRequest;
        /**
         * 统一请求入口
         * @param path
         * @param getBody
         */
        private request;
    }
}
