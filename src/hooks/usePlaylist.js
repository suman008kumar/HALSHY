import { useCallback, useEffect, useMemo, useState } from 'react';
import { parseM3U } from '../utils/m3uParser';
import { sessionFailed } from '../utils/storage';

export const PLAYLIST_URL = 'https://iptv-org.github.io/iptv/index.m3u';

export function usePlaylist() {
  const [channels, setChannels] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [failedIds, setFailedIds] = useState(() => new Set(sessionFailed.get()));

  const load = useCallback(async () => {
    setStatus('loading'); setError('');
    try {
      const response = await fetch(PLAYLIST_URL, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Playlist request failed (${response.status})`);
      const text = await response.text();
      const parsed = parseM3U(text);
      if (!parsed.length) throw new Error('The playlist contained no valid channel entries.');
      setChannels(parsed); setStatus('ready');
    } catch (err) { setError(err.message || 'Unable to load live channel guide'); setStatus('error'); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const markFailed = useCallback(id => setFailedIds(prev => {
    const next = new Set(prev); next.add(id); sessionFailed.set([...next]); return next;
  }), []);
  const markWorking = useCallback(id => setFailedIds(prev => {
    if (!prev.has(id)) return prev;
    const next = new Set(prev); next.delete(id); sessionFailed.set([...next]); return next;
  }), []);
  const retry = useCallback(id => markWorking(id), [markWorking]);

  const visibleChannels = useMemo(() => channels.filter(c => !failedIds.has(c.id)), [channels, failedIds]);
  return { channels, visibleChannels, failedIds, status, error, reload: load, markFailed, markWorking, retry };
}
