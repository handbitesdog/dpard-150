import { useState } from 'react';
import { Image } from 'react-native';
import type { ImageProps, ImageSourcePropType } from 'react-native';
import type { ImageAsset } from '@/data/assets';

type RemoteImageProps = Omit<ImageProps, 'source' | 'onError'> & {
  source: ImageAsset;
};

/** The CDN URI and bundled fallback carried by a resolved asset, if it has them. */
function partsOf(source: ImageAsset): {
  uri?: string;
  fallback?: ImageSourcePropType;
} {
  if (typeof source !== 'object' || source === null || Array.isArray(source)) {
    return {};
  }
  return source as { uri?: string; fallback?: ImageSourcePropType };
}

/**
 * `Image` for catalog art, falling back to the bundled placeholder an
 * `ImageAsset` carries when the CDN copy fails to load — a stale path, an
 * asset never uploaded, or no connection.
 *
 * Failure is tracked per URI rather than as a flag, so a recycled row that
 * receives a different image retries it instead of inheriting the last one's
 * failure.
 */
export function RemoteImage({ source, ...rest }: RemoteImageProps) {
  const [failedUri, setFailedUri] = useState<string | null>(null);
  const { uri, fallback } = partsOf(source);
  const failed = uri !== undefined && uri === failedUri;

  return (
    <Image
      {...rest}
      source={failed && fallback !== undefined ? fallback : source}
      onError={uri === undefined ? undefined : () => setFailedUri(uri)}
    />
  );
}
