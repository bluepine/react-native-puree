"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
require("./_mock-async-storage");
const queue_1 = require("../queue");
const react_native_1 = require("react-native");
ava_1.default.beforeEach(async () => {
    await react_native_1.AsyncStorage.clear();
});
ava_1.default.serial('get', async (t) => {
    const queue = new queue_1.default();
    t.deepEqual(await queue.get(), []);
    for (let i = 0; i < 3; i++) {
        await queue.push({ id: i + 1, event: 'click' });
    }
    t.deepEqual((await queue.get(2)).map(item => item.data.id), [1, 2]);
});
ava_1.default.serial('remove', async (t) => {
    const queue = new queue_1.default();
    for (let i = 0; i < 6; i++) {
        await queue.push({ id: i, event: 'click' });
    }
    const items = await queue.get();
    await queue.remove(items.slice(2, 4));
    t.deepEqual((await queue.get()).map(item => item.data.id), [0, 1, 4, 5]);
});
//# sourceMappingURL=queue.js.map