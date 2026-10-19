export function isHls(url = '') { return /\.m3u8(?:$|[?#])/i.test(url); }
export function isMp4(url = '') { return /\.mp4(?:$|[?#])/i.test(url); }
export function canNativeHls(video) { return Boolean(video?.canPlayType?.('application/vnd.apple.mpegurl')); }
export function shortError(error) {
  const code = error?.code;
  if (code === 1) return 'Playback was cancelled.';
  if (code === 2) return 'Network error while loading this stream.';
  if (code === 3) return 'This browser could not decode the stream.';
  if (code === 4) return 'This media format is not supported here.';
  return 'This channel is currently unavailable or cannot be played in this browser.';
}
