"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// persistent queue using AsyncStorage
const react_native_1 = require("react-native");
function randomizedEpochTime() {
    return new Date().getTime() + Math.random();
}
class Queue {
    async push(data) {
        if (!this.buffer)
            await this.init();
        const item = { key: data.time || randomizedEpochTime(), data };
        this.buffer.push(item);
        await this.sync();
        return item;
    }
    async get(size) {
        if (!this.buffer)
            await this.init();
        return this.buffer.slice(0, size);
    }
    async remove(items) {
        const uuids = items.map(item => item.key);
        this.buffer = this.buffer.filter(item => {
            return !uuids.includes(item.key);
        });
        return this.sync();
    }
    async init() {
        const jsonString = await react_native_1.AsyncStorage.getItem(Queue.STORAGE_KEY);
        if (jsonString) {
            this.buffer = JSON.parse(jsonString);
        }
        else {
            this.buffer = [];
            await this.sync();
        }
    }
    async sync() {
        return react_native_1.AsyncStorage.setItem(Queue.STORAGE_KEY, JSON.stringify(this.buffer));
    }
}
Queue.STORAGE_KEY = "react-native-puree:queue";
exports.default = Queue;
//# sourceMappingURL=queue.js.map