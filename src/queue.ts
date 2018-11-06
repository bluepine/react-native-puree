// persistent queue using AsyncStorage
import { AsyncStorage } from "react-native";

export interface QueueItem {
  key: string;
  data: any;
}

function randomizedEpochTime() {
  return new Date().getTime() + Math.random();
}

export default class Queue {
  static STORAGE_KEY = "react-native-puree:queue";

  buffer: QueueItem[];

  async push(data: any): Promise<QueueItem> {
    if (!this.buffer) await this.init();

    const item = { key: data.time || randomizedEpochTime(), data };
    this.buffer.push(item);
    await this.sync();
    return item;
  }

  async get(size?: number): Promise<QueueItem[]> {
    if (!this.buffer) await this.init();

    return this.buffer.slice(0, size);
  }

  async remove(items: QueueItem[]): Promise<void> {
    const uuids = items.map(item => item.key);
    this.buffer = this.buffer.filter(item => {
      return !uuids.includes(item.key);
    });

    return this.sync();
  }

  private async init() {
    const jsonString = await AsyncStorage.getItem(Queue.STORAGE_KEY);
    if (jsonString) {
      this.buffer = JSON.parse(jsonString);
    } else {
      this.buffer = [];
      await this.sync();
    }
  }

  private async sync(): Promise<void> {
    return AsyncStorage.setItem(Queue.STORAGE_KEY, JSON.stringify(this.buffer));
  }
}
