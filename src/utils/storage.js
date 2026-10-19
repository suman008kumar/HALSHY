const KEYS = { favorites: 'streamorbit:favorites', recent: 'streamorbit:recent', failed: 'streamorbit:failed', settings: 'streamorbit:settings', last: 'streamorbit:last' };

function read(key, fallback) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } }
function write(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }

export const storage = {
  getFavorites: () => read(KEYS.favorites, []),
  setFavorites: v => write(KEYS.favorites, v),
  getRecent: () => read(KEYS.recent, []),
  setRecent: v => write(KEYS.recent, v),
  getFailed: () => read(KEYS.failed, []),
  setFailed: v => write(KEYS.failed, v),
  getSettings: () => ({ autoplay: true, muteAutoplay: true, rememberLast: true, theater: false, reduceMotion: false, ...read(KEYS.settings, {}) }),
  setSettings: v => write(KEYS.settings, v),
  getLast: () => read(KEYS.last, null),
  setLast: v => write(KEYS.last, v)
};

export const sessionFailed = {
  get: () => { try { return JSON.parse(sessionStorage.getItem(KEYS.failed) || '[]'); } catch { return []; } },
  set: value => { try { sessionStorage.setItem(KEYS.failed, JSON.stringify(value)); } catch {} }
};
