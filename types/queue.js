declare interface Queue<T> {
  getLength(): number;
  peek(): T;
  enqueue(item: T): void;
  dequeue(): ?T;
  remove(callback: (element: T) => boolean): T;
}
