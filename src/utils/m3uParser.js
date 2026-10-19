const ATTR_RE = /([\w-]+)=(?:"([^"]*)"|'([^']*)'|([^\s]+))/g;

function parseAttributes(text) {
  const attrs = {};
  let match;
  while ((match = ATTR_RE.exec(text))) attrs[match[1]] = match[2] ?? match[3] ?? match[4] ?? '';
  return attrs;
}

export function parseM3U(text) {
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/);
  const channels = [];
  let pending = null;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (!line) continue;
    if (line.startsWith('#EXTINF')) {
      const comma = line.indexOf(',');
      const meta = comma >= 0 ? line.slice(0, comma) : line;
      const fallbackName = comma >= 0 ? line.slice(comma + 1).trim() : 'Unknown channel';
      const attrs = parseAttributes(meta);
      pending = { attrs, fallbackName };
      continue;
    }
    if (pending && !line.startsWith('#')) {
      const a = pending.attrs;
      const name = (a['tvg-name'] || pending.fallbackName || 'Unknown channel').trim();
      const url = line;
      const country = (a['tvg-country'] || '').trim();
      const group = (a['group-title'] || 'Uncategorized').trim() || 'Uncategorized';
      const logo = (a['tvg-logo'] || '').trim();
      const language = (a['tvg-language'] || '').trim();
      const id = `${a['tvg-id'] || name}-${url}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 180);
      channels.push({ id, name, logo, country, group, language, url, tvgId: a['tvg-id'] || '', index: channels.length });
      pending = null;
    }
  }
  return channels;
}

export function countryCode(country) {
  const raw = String(country || '').trim();
  if (!raw) return '';
  return raw.split(/[;,\s]+/)[0].toUpperCase();
}

export function countryFlag(code) {
  const cc = countryCode(code);
  if (!/^[A-Z]{2}$/.test(cc)) return '🌎';
  return String.fromCodePoint(...[...cc].map(c => 127397 + c.charCodeAt(0)));
}

export function displayCountry(code) {
  const cc = countryCode(code);
  if (!cc) return 'International';
  try { return new Intl.DisplayNames(['en'], { type: 'region' }).of(cc) || cc; } catch { return cc; }
}
