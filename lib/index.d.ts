import Queue, { QueueItem } from './queue';
export declare type Log = object;
export declare type OutputHandler = (logs: Log[]) => Promise<void>;
export declare type PureeFilter = (log: Log) => Log;
export interface PureeConfig {
    flushInterval?: number;
    maxRetry?: number;
    firstRetryInterval?: number;
}
export default class Puree {
    static DEFAULT_FLUSH_INTERVAL: number;
    static LOG_LIMIT: number;
    static DEFAULT_MAX_RETRY: number;
    static DEFAULT_FIRST_RETRY_INTERVAL: number;
    queue: Queue;
    buffer: QueueItem[];
    filters: PureeFilter[];
    flushInterval: number;
    maxRetry: number;
    firstRetryInterval: number;
    private flushHandler;
    constructor(config?: PureeConfig);
    addFilter(f: PureeFilter): void;
    addOutput(handler: OutputHandler): void;
    start(): Promise<void>;
    send(log: Log): Promise<void>;
    applyFilters(value: any): Log;
    flush(): Promise<void>;
    private process(logs, retryCount?);
    private initBuffer();
}
