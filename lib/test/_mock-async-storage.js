"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mock = require("mock-require");
mock('react-native', {
    AsyncStorage: {
        async setItem(key, value) {
            this.database = this.database || {};
            this.database[key] = value;
        },
        async getItem(key) {
            this.database = this.database || {};
            return this.database[key];
        },
        async clear() {
            this.database = {};
        }
    }
});
//# sourceMappingURL=_mock-async-storage.js.map