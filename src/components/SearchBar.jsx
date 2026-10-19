import { Search, X } from 'lucide-react';
export default function SearchBar({ query, setQuery }) { return <div className="mobile-main-search"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search live channels…"/><button onClick={()=>setQuery('')}><X size={16}/></button></div>; }
