var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define("interaction", ["require", "exports", "readline"], function (require, exports, readline) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    readline = __importStar(readline);
    var default_1 = /** @class */ (function () {
        function default_1() {
        }
        Object.defineProperty(default_1.prototype, "interface", {
            get: function () {
                if (!this._rl) {
                    this._rl = readline.createInterface({
                        input: process.stdin,
                        output: process.stdout,
                    });
                }
                return this._rl;
            },
            enumerable: false,
            configurable: true
        });
        default_1.prototype.question = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            _this.interface.question(query, resolve);
                        })];
                });
            });
        };
        default_1.prototype.close = function () {
            var _a;
            (_a = this._rl) === null || _a === void 0 ? void 0 : _a.close();
        };
        default_1.prototype.info = function (message) {
            var optionalParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                optionalParams[_i - 1] = arguments[_i];
            }
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.info.apply(console, __spreadArray([message], optionalParams, false));
                            return [4 /*yield*/, new Promise(function (resolve) {
                                    setTimeout(resolve, 500);
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        default_1.prototype.error = function (message) {
            var optionalParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                optionalParams[_i - 1] = arguments[_i];
            }
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.error.apply(console, __spreadArray([message], optionalParams, false));
                            return [4 /*yield*/, new Promise(function (resolve) {
                                    setTimeout(resolve, 500);
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return default_1;
    }());
    exports.default = default_1;
});
define("index", ["require", "exports", "http", "interaction", "fs", "path"], function (require, exports, http, interaction_1, fs, path) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tomcat = void 0;
    http = __importStar(http);
    interaction_1 = __importDefault(interaction_1);
    fs = __importStar(fs);
    path = __importStar(path);
    var Tomcat = /** @class */ (function () {
        function Tomcat(opts) {
            if (opts === void 0) { opts = { interactiveMode: true }; }
            this._opts = {};
            this._interactiveMode = opts.interactiveMode;
            if (opts.url) {
                this.setUrl(opts.url);
            }
            if (opts.user) {
                this.setAuth(opts.user, opts.password);
            }
            if (this._interactiveMode && (!this._opts.hostname || !this._opts.auth)) {
                throw new Error('非对话模式需要提供有效的 url 及 user、password 值！');
            }
        }
        /**
         * 设置 tomcat url，返回 boolean 表示是否设置（是否变化）
         * @param url
         */
        Tomcat.prototype.setUrl = function (url) {
            if (!url) {
                return false;
            }
            var arr = /^\s*(https?:\/\/)?([^\s:\/]+)(:\d+)?\s*$/i.exec(url);
            if (!arr) {
                return false;
            }
            var protocol = arr[1] ? arr[1].slice(0, -2) : 'http:';
            var hostname = arr[2];
            var port = arr[3] ? arr[3].slice(1) : '8080';
            if (this._opts.protocol === protocol && this._opts.hostname === hostname && this._opts.port === port) {
                return false;
            }
            this._opts.protocol = protocol;
            this._opts.hostname = hostname;
            this._opts.port = port;
            return true;
        };
        /**
         * 设置 tomcat 管理用户及密码，返回 boolean 表示是否设置（是否变化）
         * @param user
         * @param pass
         */
        Tomcat.prototype.setAuth = function (user, pass) {
            if (pass === void 0) { pass = ''; }
            if (!user) {
                if ('auth' in this._opts) {
                    delete this._opts.auth;
                    return true;
                }
            }
            else {
                var auth = user + ":" + pass;
                if (this._opts.auth !== auth) {
                    this._opts.auth = auth;
                    return true;
                }
            }
            return false;
        };
        /**
         * 获取 tomcat 服务器信息
         */
        Tomcat.prototype.serverInfo = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.request("/manager/text/serverinfo")];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        /**
         * 获取 tomcat 当前部署的站点
         */
        Tomcat.prototype.list = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.request("/manager/text/list")];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        /**
         * 部署 war 包，返回部署成功的结果
         * @param warFile
         * @param contextPath
         * 未指定时，如果 warFile 为文件路径时使用 warFile 文件名作为 contextPath
         * @param force
         * 是否强制部署，如果 contextPath 存在则强制替换
         */
        Tomcat.prototype.deploy = function (warFile, contextPath, force) {
            if (force === void 0) { force = true; }
            return __awaiter(this, void 0, void 0, function () {
                var getBody, stream, ext, name_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!warFile) {
                                throw new Error('warFile 参数不能为空！');
                            }
                            if (typeof warFile === 'string') {
                                if (!fs.existsSync(warFile)) {
                                    throw new Error("\u6587\u4EF6\u201C" + warFile + "\u201D\u4E0D\u5B58\u5728\uFF01");
                                }
                                ext = path.extname(warFile);
                                if ((ext === null || ext === void 0 ? void 0 : ext.toLowerCase()) !== '.war') {
                                    throw new Error("\u6587\u4EF6\u201C" + warFile + "\u201D\u4E0D\u662F\u6709\u6548\u7684 war \u5305\uFF01");
                                }
                                if (!contextPath) {
                                    name_1 = path.basename(warFile);
                                    contextPath = name_1.substr(0, name_1.length - ext.length);
                                }
                                getBody = function () {
                                    if (stream) {
                                        stream.close();
                                    }
                                    stream = fs.createReadStream(warFile);
                                    return stream;
                                };
                            }
                            else {
                                if (!contextPath) {
                                    throw new Error('contextPath 参数不能为空！');
                                }
                                getBody = function () { return warFile; };
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, , 3, 4]);
                            return [4 /*yield*/, this.request("/manager/text/deploy?path=/" + contextPath + "&update=" + force, getBody)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            stream === null || stream === void 0 ? void 0 : stream.close();
                            return [7 /*endfinally*/];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * 删除部署站点
         * @param contextPath
         */
        Tomcat.prototype.unDeploy = function (contextPath) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!contextPath) {
                                throw new Error('contextPath 参数不能为空！');
                            }
                            return [4 /*yield*/, this.request("/manager/text/undeploy?path=" + contextPath)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        /**
         * 实际的 http 请求，返回的 code 说明：
         * -2：请求过程异常或返回内容无效
         * -1：未认证
         *  0：处理成功，返回 OK - XXXX
         *  1：处理失败，返回 FAIL - XXXX
         * @param path
         * @param getBody
         */
        Tomcat.prototype.http = function (path, getBody) {
            return __awaiter(this, void 0, void 0, function () {
                var opts;
                return __generator(this, function (_a) {
                    opts = __assign(__assign({}, this._opts), { method: getBody ? 'put' : 'get', path: path });
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            var error = function (err) { return resolve({ code: -2, data: err }); };
                            var req = http.request(opts, function (res) {
                                var sb = [];
                                res.setEncoding('utf8')
                                    .on('data', function (chunk) { return sb.push(chunk); })
                                    .on('error', error)
                                    .on('end', function () {
                                    if (res.statusCode === 401) {
                                        resolve({ code: -1 });
                                    }
                                    else {
                                        var arr = /^(\S+)\s*-\s*(.+)$/s.exec(sb.join(''));
                                        if (!arr) {
                                            error(new Error('无效的内容，非 tomcat 服务！'));
                                        }
                                        else if (arr[1] === 'OK') {
                                            resolve({ code: 0, data: arr[2] });
                                        }
                                        else {
                                            resolve({ code: 1, data: arr[2] });
                                        }
                                    }
                                });
                            });
                            req.on('error', error);
                            getBody ? getBody().pipe(req, { end: true }) : req.end();
                        })];
                });
            });
        };
        /**
         * http 请求包装，检查 url、user、password 是否有效
         * @param path
         * @param getBody
         */
        Tomcat.prototype.normalRequest = function (path, getBody) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this._opts.hostname) {
                                throw new Error('tomcat url 无效！');
                            }
                            if (!this._opts.auth) {
                                throw new Error('tomcat 管理用户及密码无效！');
                            }
                            return [4 /*yield*/, this.http(path, getBody)];
                        case 1:
                            result = _a.sent();
                            if (result.code) {
                                throw (result.data instanceof Error ? result.data : new Error(result.data));
                            }
                            return [2 /*return*/, result.data];
                    }
                });
            });
        };
        /**
         * http 对话模式请求包装，如果请求失败尝试获取用户输入后重新请求
         * @param path
         * @param getBody
         */
        Tomcat.prototype.interactiveRequest = function (path, getBody) {
            return __awaiter(this, void 0, void 0, function () {
                var interaction, url, _a, user, pass, result;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            interaction = new interaction_1.default();
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, , 13, 14]);
                            _b.label = 2;
                        case 2:
                            if (!true) return [3 /*break*/, 12];
                            if (!!this._opts.hostname) return [3 /*break*/, 6];
                            return [4 /*yield*/, interaction.question('请输入 tomcat 部署地址：')];
                        case 3:
                            url = _b.sent();
                            if (!(!this.setUrl(url) || !this._opts.hostname)) return [3 /*break*/, 6];
                            _a = url;
                            if (!_a) return [3 /*break*/, 5];
                            return [4 /*yield*/, interaction.error("tomcat \u90E8\u7F72\u5730\u5740\u201C" + url + "\u201D\u65E0\u6548\uFF01")];
                        case 4:
                            _a = (_b.sent());
                            _b.label = 5;
                        case 5:
                            _a;
                            return [3 /*break*/, 2];
                        case 6:
                            if (!!this._opts.auth) return [3 /*break*/, 10];
                            return [4 /*yield*/, interaction.question('请输入用户名：')];
                        case 7:
                            user = _b.sent();
                            if (!user) {
                                return [3 /*break*/, 2];
                            }
                            return [4 /*yield*/, interaction.question('请输入密码：')];
                        case 8:
                            pass = _b.sent();
                            if (!(!this.setAuth(user, pass) || !this._opts.auth)) return [3 /*break*/, 10];
                            return [4 /*yield*/, interaction.error("\u7528\u6237\u540D\u201C" + user + "\u201D\u5BC6\u7801\u65E0\u6548\uFF01")];
                        case 9:
                            _b.sent();
                            return [3 /*break*/, 2];
                        case 10: return [4 /*yield*/, this.http(path, getBody)];
                        case 11:
                            result = _b.sent();
                            if (result.code === -2) {
                                delete this._opts.hostname;
                                delete this._opts.protocol;
                                delete this._opts.port;
                            }
                            else if (result.code === -1) {
                                delete this._opts.auth;
                            }
                            else {
                                if (result.code) {
                                    throw (result.data instanceof Error ? result.data : new Error(result.data));
                                }
                                return [2 /*return*/, result.data];
                            }
                            return [3 /*break*/, 2];
                        case 12: return [3 /*break*/, 14];
                        case 13:
                            interaction.close();
                            return [7 /*endfinally*/];
                        case 14: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * 统一请求入口
         * @param path
         * @param getBody
         */
        Tomcat.prototype.request = function (path, getBody) {
            return this._interactiveMode ? this.interactiveRequest(path, getBody) : this.normalRequest(path, getBody);
        };
        return Tomcat;
    }());
    exports.Tomcat = Tomcat;
});
