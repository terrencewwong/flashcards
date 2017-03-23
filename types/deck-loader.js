declare interface DeckLoader {
  isLoaded(): boolean;
  setLoaded(state: boolean): void;
  load(): any[];
  getCardRenderer(): any;
  getStorage(): Database;
}
