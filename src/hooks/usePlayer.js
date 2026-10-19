import { useCallback, useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { canNativeHls, isHls } from '../utils/streamUtils';

export function usePlayer({ channel, autoplay = true, muted = true, onWorking, onFailed }) {
  const videoRef = useRef(null); const hlsRef = useRef(null); const failureTimer = useRef(null);
  const [state, setState] = useState('idle'); const [error, setError] = useState(''); const [qualities, setQualities] = useState([]); const [quality, setQuality] = useState(-1);

  const cleanup = useCallback(() => { clearTimeout(failureTimer.current); if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; } const v = videoRef.current; if (v) { v.pause(); v.removeAttribute('src'); v.load(); } setQualities([]); setQuality(-1); }, []);

  const fail = useCallback(message => { setState('error'); setError(message || 'Stream unavailable'); onFailed?.(channel?.id); }, [channel?.id, onFailed]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !channel) return undefined;
    cleanup(); setError(''); setState('loading'); video.muted = muted;
    const onPlaying = () => { clearTimeout(failureTimer.current); setState('playing'); onWorking?.(channel.id); };
    const onWaiting = () => setState('buffering');
    const onCanPlay = () => setState(s => s === 'loading' ? 'ready' : s);
    const onError = () => fail('This channel is currently unavailable or cannot be played in this browser.');
    video.addEventListener('playing', onPlaying); video.addEventListener('waiting', onWaiting); video.addEventListener('canplay', onCanPlay); video.addEventListener('error', onError);

    const start = async () => {
      try {
        if (isHls(channel.url)) {
          if (canNativeHls(video)) { video.src = channel.url; }
          else if (Hls.isSupported()) {
            const hls = new Hls({ enableWorker: true, lowLatencyMode: true, backBufferLength: 30, maxBufferLength: 20 });
            hlsRef.current = hls;
            hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => { const levels = data.levels || []; setQualities(levels.map((l, i) => ({ index: i, label: l.height ? `${l.height}p` : `${Math.round(l.bitrate / 1000)} kbps` }))); if (autoplay) video.play().catch(() => {}); });
            hls.on(Hls.Events.ERROR, (_, data) => { if (data.fatal) { if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad(); else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError(); else fail('Stream unavailable'); } });
            hls.loadSource(channel.url); hls.attachMedia(video);
          } else throw new Error('HLS is not supported by this browser.');
        } else { video.src = channel.url; }
        if (autoplay) { try { await video.play(); } catch { video.muted = true; await video.play().catch(() => {}); } }
      } catch (e) { fail(e.message); }
    };
    failureTimer.current = setTimeout(() => { if (!['playing','ready'].includes(state)) fail('Stream timed out while loading.'); }, 15000);
    start();
    return () => { video.removeEventListener('playing', onPlaying); video.removeEventListener('waiting', onWaiting); video.removeEventListener('canplay', onCanPlay); video.removeEventListener('error', onError); cleanup(); };
  // state intentionally omitted: timer must not restart on playback-state changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel?.id, channel?.url, autoplay, muted]);

  const retry = useCallback(() => { if (!channel) return; setState('loading'); setError(''); const v = videoRef.current; if (v) { v.load(); v.play().catch(() => {}); } }, [channel]);
  const setQualityLevel = useCallback(index => { if (hlsRef.current) hlsRef.current.currentLevel = Number(index); setQuality(Number(index)); }, []);
  useEffect(() => () => cleanup(), [cleanup]);
  return { videoRef, hlsRef, state, error, retry, qualities, quality, setQuality: setQualityLevel };
}
