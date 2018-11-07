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
var _this = this;
exports.__esModule = true;
var ava_1 = require("ava");
require("./_mock-async-storage");
var __1 = require("../");
var react_native_1 = require("react-native");
function addEventTime(log) {
    return Object.assign({ time: Math.floor(new Date().getTime() / 1000) }, log);
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
ava_1["default"].beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, react_native_1.AsyncStorage.clear()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
ava_1["default"].serial('send log with filters', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var puree;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                puree = new __1["default"]();
                puree.addOutput(function (logs) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        t.is(logs.length, 1);
                        t.is(logs[0].table_name, 'foobar');
                        t.is(logs[0].action, 'click');
                        return [2 /*return*/];
                    });
                }); });
                puree.addFilter(addEventTime);
                puree.addFilter(function (log) {
                    return Object.assign(log, { table_name: 'foobar' });
                });
                return [4 /*yield*/, puree.send({ action: 'click' })];
            case 1:
                _a.sent();
                return [4 /*yield*/, puree.flush()];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
ava_1["default"].serial('flush logs', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var puree, called;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                puree = new __1["default"]();
                called = 0;
                puree.addOutput(function (logs) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        called += 1;
                        t.is(logs.length, 1);
                        t.deepEqual(logs, [
                            { action: 'click' }
                        ]);
                        return [2 /*return*/];
                    });
                }); });
                return [4 /*yield*/, puree.flush()]; // logs should be empty
            case 1:
                _a.sent(); // logs should be empty
                return [4 /*yield*/, puree.send({ action: 'click' })];
            case 2:
                _a.sent();
                return [4 /*yield*/, puree.flush()];
            case 3:
                _a.sent();
                return [4 /*yield*/, puree.flush()]; // logs should be empty
            case 4:
                _a.sent(); // logs should be empty
                t.is(called, 1);
                return [2 /*return*/];
        }
    });
}); });
ava_1["default"].serial('flush after the interval', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var puree;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                puree = new __1["default"]({ flushInterval: 1 * 10 });
                puree.addFilter(addEventTime);
                puree.addOutput(function (logs) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        t.pass();
                        return [2 /*return*/];
                    });
                }); });
                return [4 /*yield*/, puree.start()];
            case 1:
                _a.sent();
                puree.send({ action: 'click' });
                return [4 /*yield*/, wait(2 * 10)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
ava_1["default"].serial('retry with exponential backoff', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var puree, called;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                puree = new __1["default"]({ flushInterval: 10 });
                called = 0;
                puree.addOutput(function (logs) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        called += 1;
                        throw new Error('wtf');
                    });
                }); });
                return [4 /*yield*/, puree.start()];
            case 1:
                _a.sent();
                puree.send({ action: 'click' });
                return [4 /*yield*/, wait(10 * 1)];
            case 2:
                _a.sent();
                t.is(called, 1);
                return [4 /*yield*/, wait(50)];
            case 3:
                _a.sent();
                t.is(called, 1);
                return [4 /*yield*/, wait(1 * 1000)];
            case 4:
                _a.sent();
                t.is(called, 2);
                return [4 /*yield*/, wait(2 * 1000)];
            case 5:
                _a.sent();
                t.is(called, 3);
                return [2 /*return*/];
        }
    });
}); });
ava_1["default"].serial('max retry', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var maxRetry, puree, called;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                maxRetry = 2;
                puree = new __1["default"]({ maxRetry: maxRetry, flushInterval: 10, firstRetryInterval: 10 });
                called = 0;
                puree.addOutput(function (logs) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        called += 1;
                        throw new Error('wtf');
                    });
                }); });
                return [4 /*yield*/, puree.start()];
            case 1:
                _a.sent();
                puree.send({ action: 'click' });
                return [4 /*yield*/, wait(10 * 10)];
            case 2:
                _a.sent();
                t.is(called, maxRetry + 1);
                return [2 /*return*/];
        }
    });
}); });
