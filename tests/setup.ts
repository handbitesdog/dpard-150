import * as matchers from '@testing-library/react-native/matchers';
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';
import 'react-native-gesture-handler/jestSetup';

expect.extend(matchers);
jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);

// react-native-mmkv detects Jest via JEST_WORKER_ID and substitutes an
// in-memory instance, so the persisted stores work in tests without a native
// module. Each test file that asserts on persisted state is responsible for
// resetting the store it touches.
