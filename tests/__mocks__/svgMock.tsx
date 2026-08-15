import { forwardRef } from 'react';
import { View } from 'react-native';
import type { SvgProps } from 'react-native-svg';

const SvgMock = forwardRef<View, SvgProps>((props, ref) => <View ref={ref} {...props} />);
SvgMock.displayName = 'SvgMock';

export default SvgMock;
