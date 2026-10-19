import { ChevronDown, Globe2, Search, X } from 'lucide-react';
import { countryCode, countryFlag, displayCountry } from '../utils/m3uParser';
import { useMemo, useState } from 'react';

export default function CountrySelector({ channels, selected, setSelected }) {
  const [open, setOpen] = useState(false); const [search, setSearch] = useState('');
  const countries = useMemo(() => { const map = new Map(); channels.forEach(c => { const code = countryCode(c.country); if (code) map.set(code, (map.get(code) || 0) + 1); }); return [...map].sort((a,b) => displayCountry(a[0]).localeCompare(displayCountry(b[0]))); }, [channels]);
  const matching = countries.filter(([code]) => displayCountry(code).toLowerCase().includes(search.toLowerCase()) || code.toLowerCase().includes(search.toLowerCase()));
  const topFive = useMemo(() => { const india = countries.find(([code]) => code === 'IN'); const rest = countries.filter(([code]) => code !== 'IN').sort((a,b) => b[1] - a[1]).slice(0,3); return india ? [india, ...rest] : rest.slice(0,4); }, [countries]);
  const shown = search.trim() ? matching : topFive;
  return <div className="country-wrap"><button className="country-trigger" onClick={() => setOpen(v => !v)}><Globe2 size={18}/><span>{selected === 'ALL' ? 'All Countries' : `${countryFlag(selected)} ${displayCountry(selected)}`}</span><ChevronDown size={17}/></button>
    {open && <><div className="popover-backdrop" onClick={() => setOpen(false)}/><div className="country-popover"><div className="popover-head"><b>Countries</b><button onClick={() => setOpen(false)}><X size={17}/></button></div><div className="country-search"><Search size={16}/><input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Find a country…"/></div><button className={`country-option ${selected === 'ALL' ? 'selected' : ''}`} onClick={() => {setSelected('ALL');setOpen(false)}}><span>🌎 All Countries</span><small>{channels.length}</small></button>{shown.map(([code,count]) => <button key={code} className={`country-option ${selected === code ? 'selected' : ''}`} onClick={() => {setSelected(code);setOpen(false)}}><span>{countryFlag(code)} {displayCountry(code)}</span><small>{count}</small></button>)}<div className="country-foot">Showing 4 countries · Search to find any of {countries.length} countries · {channels.length.toLocaleString()} channels</div></div></>}
  </div>;
}
