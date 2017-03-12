declare interface DeckLoader {
  isLoaded(name: string): boolean;
  setLoaded(name: string, state: boolean): void;
  load(name: string): any[];
}
