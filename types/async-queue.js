declare interface AsyncQueue<T> {
  getLength(): Promise<number>;
  peek(): Promise<T>;
  enqueue(item: T): Promise<void>;
  dequeue(): Promise<T>;
  remove(callback?: (element: T) => boolean): Promise<T[]>;
}
