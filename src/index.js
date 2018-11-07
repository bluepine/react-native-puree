"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
exports.__esModule = true;
var queue_1 = require("./queue");
function debugLog(message) {
    if (global.__DEV__) {
        console.log("[puree] " + message);
    }
}
function wait(interval) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve) { setTimeout(resolve, interval); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
var Puree = /** @class */ (function () {
    function Puree(config) {
        if (config === void 0) { config = {}; }
        this.queue = new queue_1["default"]();
        this.filters = [];
        this.flushInterval = config.flushInterval || Puree.DEFAULT_FLUSH_INTERVAL;
        this.maxRetry = config.maxRetry || Puree.DEFAULT_MAX_RETRY;
        this.firstRetryInterval = config.firstRetryInterval || Puree.DEFAULT_FIRST_RETRY_INTERVAL;
    }
    Puree.prototype.addFilter = function (f) {
        this.filters.push(f);
    };
    Puree.prototype.addOutput = function (handler) {
        this.flushHandler = handler;
    };
    Puree.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.flush()];
                    case 1:
                        _a.sent();
                        setInterval(function () {
                            _this.flush();
                        }, this.flushInterval);
                        return [2 /*return*/];
                }
            });
        });
    };
    Puree.prototype.send = function (log) {
        return __awaiter(this, void 0, void 0, function () {
            var queueItem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log = this.applyFilters(log);
                        if (!(this.buffer === undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.initBuffer()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.queue.push(log)];
                    case 3:
                        queueItem = _a.sent();
                        this.buffer.push(queueItem);
                        debugLog("Recorded a log: " + JSON.stringify(log));
                        return [2 /*return*/];
                }
            });
        });
    };
    Puree.prototype.applyFilters = function (value) {
        this.filters.forEach(function (f) {
            value = f(value);
        });
        return value;
    };
    Puree.prototype.flush = function () {
        return __awaiter(this, void 0, void 0, function () {
            var items, logs, handledError;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.buffer === undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.initBuffer()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        items = this.buffer.splice(0, Puree.LOG_LIMIT);
                        if (items.length === 0)
                            return [2 /*return*/];
                        debugLog("Flushing " + items.length + " logs");
                        logs = items.map(function (item) { return item.data; });
                        return [4 /*yield*/, this.process(logs)];
                    case 3:
                        handledError = _a.sent();
                        if (handledError) {
                            console.error(handledError);
                            return [2 /*return*/];
                        }
                        debugLog("Finished processing logs: " + JSON.stringify(logs));
                        return [2 /*return*/, this.queue.remove(items)];
                }
            });
        });
    };
    Puree.prototype.process = function (logs, retryCount) {
        if (retryCount === void 0) { retryCount = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 4]);
                        return [4 /*yield*/, this.flushHandler(logs)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        e_1 = _a.sent();
                        if (retryCount >= this.maxRetry) {
                            return [2 /*return*/, new Error('retryCount exceeded max retry')];
                        }
                        console.warn("Error occurred! Retrying... (retry count: " + retryCount + ")", e_1);
                        return [4 /*yield*/, wait(Math.pow(2, retryCount) * this.firstRetryInterval)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, this.process(logs, retryCount + 1)];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Puree.prototype.initBuffer = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.queue.get()];
                    case 1:
                        _a.buffer = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Puree.DEFAULT_FLUSH_INTERVAL = 2 * 60 * 1000;
    Puree.LOG_LIMIT = 10;
    Puree.DEFAULT_MAX_RETRY = 5;
    Puree.DEFAULT_FIRST_RETRY_INTERVAL = 1 * 1000;
    return Puree;
}());
exports["default"] = Puree;
