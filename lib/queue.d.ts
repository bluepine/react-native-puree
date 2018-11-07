export interface QueueItem {
    key: string;
    data: any;
}
export default class Queue {
    static STORAGE_KEY: string;
    buffer: QueueItem[];
    push(data: any): Promise<QueueItem>;
    get(size?: number): Promise<QueueItem[]>;
    remove(items: QueueItem[]): Promise<void>;
    private init();
    private sync();
}
