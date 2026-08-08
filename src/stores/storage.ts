import { createMMKV } from 'react-native-mmkv';
import type { StateStorage } from 'zustand/middleware';

/**
 * The single MMKV instance backing every persisted store.
 *
 * Under Jest, react-native-mmkv substitutes an in-memory implementation, so
 * stores are testable without the native module.
 */
export const storage = createMMKV({ id: 'dpard' });

/**
 * Adapts MMKV to the synchronous `StateStorage` shape zustand's persist
 * middleware expects. Because every call is synchronous, stores finish
 * rehydrating during creation rather than on a later tick.
 */
export const mmkvStorage: StateStorage = {
  getItem: (name) => storage.getString(name) ?? null,
  setItem: (name, value) => {
    storage.set(name, value);
  },
  removeItem: (name) => {
    storage.remove(name);
  },
};

/** Wipes every persisted store. Used by the dev-only reset control. */
export function clearAllPersistedState(): void {
  storage.clearAll();
}
