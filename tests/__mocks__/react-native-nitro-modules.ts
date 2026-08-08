/**
 * Stands in for the Nitro native layer under Jest.
 *
 * react-native-mmkv already substitutes an in-memory instance when it detects a
 * test runner, but that check happens inside `createMMKV()` — importing the
 * module still pulls in Nitro, which throws at load time because there is no
 * native runtime. Mocking Nitro lets MMKV's real module graph load so its own
 * mock path is what the stores run against.
 */
export const NitroModules = {
  createHybridObject: () => {
    throw new Error(
      'NitroModules.createHybridObject was called in a test. Native-backed ' +
        'objects should be mocked at the module that wraps them.',
    );
  },
  box: (value: unknown) => value,
};

export function installWorkletsSupport(): void {}

export function getHybridObjectConstructor(): never {
  throw new Error('getHybridObjectConstructor is not available in tests.');
}
