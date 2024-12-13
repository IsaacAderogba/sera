import { AudioAction, ThemePreference } from "../preload/types";

interface CacheSchema {
  "theme-preference": ThemePreference;
  "audio-action": AudioAction;
}

export class Cache {
  set<T extends keyof CacheSchema>(key: T, value: CacheSchema[T]) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }

  get<T extends keyof CacheSchema>(key: T): CacheSchema[T] | null {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (err) {
      this.remove(key);
      return null;
    }
  }

  remove<T extends keyof CacheSchema>(key: T): void {
    window.localStorage.removeItem(key);
  }
}

export const cache = new Cache();
