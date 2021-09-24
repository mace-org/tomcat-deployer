type RequestMockOptions = {
    reqError?: Error,
    resError?: Error,
    resData?: string | string[],
    resStatusCode?: number
}

class Callbacks {
    private _callbacks: Record<string, Function[]> = {};

    push(key: string, cb: Function) {
        const cbs = this._callbacks[key] || (this._callbacks[key] = []);
        cbs.push(cb);
    }

    each(key: string, ...args: any[]) {
        const cbs = this._callbacks[key];
        if (cbs) {
            cbs.forEach(cb => cb(...args));
        }
    }

    clear() {
        this._callbacks = {};
    }
}

export class RequestMock {
    private _callbacks = new Callbacks();
    private _opts: RequestMockOptions = {};
    private _request?: jest.Mock<any, any>;

    get request(): jest.Mock<any, any> {
        return this._request || (this._request = this.mockRequest());
    }

    setOptions(opts: RequestMockOptions) {
        this._opts = {...opts};
    }

    private onRequestEnd(callback: Function) {
        const {reqError} = this._opts;
        if (reqError) {
            this._callbacks.each('req:error', reqError);
        } else {
            const res = this.mockResponse();
            Promise.resolve().then(() => callback(res)).then(() => this.emitResponse());
        }
    }

    private emitResponse() {
        const {resError, resData} = this._opts;
        if (resError) {
            this._callbacks.each('res:error', resError);
        } else if (resData) {
            const data = Array.isArray(resData) ? resData : [resData];
            data.forEach(d => this._callbacks.each('res:data', d));
        }
        this._callbacks.each('res:end');
    }

    private mockResponse() {
        const that = this;

        const res = {
            setEncoding: jest.fn().mockReturnThis(),
            on: jest.fn(function (name, cb) {
                that._callbacks.push(`res:${name}`, cb);
                // @ts-ignore
                return this;
            }),
            //statusCode: jest.
        };

        Object.defineProperty(res, 'statusCode', {
            get: jest.fn(() => that._opts.resStatusCode || 200),
        });

        return res;
    }

    private mockRequest() {
        const that = this;

        return jest.fn((opts, callback) => {
            this._callbacks.clear();

            return {
                on: jest.fn(function (name, cb) {
                    if (name === 'error') {
                        that._callbacks.push('req:error', cb);
                    }
                    // @ts-ignore
                    return this;
                }),
                end: jest.fn(function () {
                    that.onRequestEnd(callback);
                    // @ts-ignore
                    return this;
                })
            };
        });
    }
}