"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const queue_1 = require("./queue");
function debugLog(message) {
    if (global.__DEV__) {
        console.log(`[puree] ${message}`);
    }
}
async function wait(interval) {
    await new Promise((resolve) => { setTimeout(resolve, interval); });
}
class Puree {
    constructor(config = {}) {
        this.queue = new queue_1.default();
        this.filters = [];
        this.flushInterval = config.flushInterval || Puree.DEFAULT_FLUSH_INTERVAL;
        this.maxRetry = config.maxRetry || Puree.DEFAULT_MAX_RETRY;
        this.firstRetryInterval = config.firstRetryInterval || Puree.DEFAULT_FIRST_RETRY_INTERVAL;
    }
    addFilter(f) {
        this.filters.push(f);
    }
    addOutput(handler) {
        this.flushHandler = handler;
    }
    async start() {
        await this.flush();
        setInterval(() => {
            this.flush();
        }, this.flushInterval);
    }
    async send(log) {
        log = this.applyFilters(log);
        if (this.buffer === undefined)
            await this.initBuffer();
        const queueItem = await this.queue.push(log);
        this.buffer.push(queueItem);
        debugLog(`Recorded a log: ${JSON.stringify(log)}`);
    }
    applyFilters(value) {
        this.filters.forEach(f => {
            value = f(value);
        });
        return value;
    }
    async flush() {
        if (this.buffer === undefined)
            await this.initBuffer();
        const items = this.buffer.splice(0, Puree.LOG_LIMIT);
        if (items.length === 0)
            return;
        debugLog(`Flushing ${items.length} logs`);
        const logs = items.map(item => item.data);
        const handledError = await this.process(logs);
        if (handledError) {
            console.error(handledError);
            return;
        }
        debugLog(`Finished processing logs: ${JSON.stringify(logs)}`);
        return this.queue.remove(items);
    }
    async process(logs, retryCount = 0) {
        try {
            await this.flushHandler(logs);
        }
        catch (e) {
            if (retryCount >= this.maxRetry) {
                return new Error('retryCount exceeded max retry');
            }
            console.warn(`Error occurred! Retrying... (retry count: ${retryCount})`, e);
            await wait(Math.pow(2, retryCount) * this.firstRetryInterval);
            return this.process(logs, retryCount + 1);
        }
    }
    async initBuffer() {
        this.buffer = await this.queue.get();
    }
}
Puree.DEFAULT_FLUSH_INTERVAL = 2 * 60 * 1000;
Puree.LOG_LIMIT = 10;
Puree.DEFAULT_MAX_RETRY = 5;
Puree.DEFAULT_FIRST_RETRY_INTERVAL = 1 * 1000;
exports.default = Puree;
//# sourceMappingURL=index.js.map