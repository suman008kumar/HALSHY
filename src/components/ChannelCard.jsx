import { Heart, Play } from 'lucide-react';
import ChannelLogo from './ChannelLogo';
import { countryFlag, displayCountry } from '../utils/m3uParser';

export default function ChannelCard({ channel, favorite, working, onFavorite, onPlay }) {
  return <article className="channel-card" onClick={() => onPlay(channel)} tabIndex="0" onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPlay(channel); } }}>
    <div className="card-art"><ChannelLogo channel={channel}/><button className={`favorite-btn ${favorite ? 'liked' : ''}`} onClick={e => { e.stopPropagation(); onFavorite(channel.id); }} aria-label={favorite ? 'Remove favorite' : 'Add favorite'}><Heart size={16} fill={favorite ? 'currentColor' : 'none'}/></button><div className="play-overlay"><span><Play size={18} fill="currentColor"/></span></div></div>
    <div className="card-copy"><div className="card-title" title={channel.name}>{channel.name}</div><div className="card-meta"><span>{countryFlag(channel.country)} {displayCountry(channel.country)}</span><span>{channel.group}</span></div></div>
  </article>;
}
