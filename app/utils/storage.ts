// Lightweight storage wrapper used by the app.
// Tries to require '@react-native-async-storage/async-storage' at runtime.
// If it's not available, falls back to an in-memory Map (non-persistent).

type AsyncStorageLike = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
};

let impl: AsyncStorageLike | null = null;

try {
  // use require so TypeScript doesn't statically resolve the module
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const pkg = require('@react-native-async-storage/async-storage');
  impl = pkg && (pkg.default || pkg);
} catch (e) {
  // package not installed — use in-memory fallback
  impl = null;
}

const memory = new Map<string, string>();

export async function getItem(key: string): Promise<string | null> {
  if (impl && impl.getItem) {
    return impl.getItem(key);
  }
  return memory.has(key) ? memory.get(key)! : null;
}

export async function setItem(key: string, value: string): Promise<void> {
  if (impl && impl.setItem) {
    return impl.setItem(key, value);
  }
  memory.set(key, value);
  return Promise.resolve();
}

export async function removeItem(key: string): Promise<void> {
  if (impl && impl.removeItem) {
    return impl.removeItem(key);
  }
  memory.delete(key);
  return Promise.resolve();
}

export default { getItem, setItem, removeItem };