declare interface Database {
  get(key: string): Promise<any>;
  put(key: string, value: any): Promise<?Error>;
  destroy(): Promise<any>;
}
