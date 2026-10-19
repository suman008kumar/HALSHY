import { ChevronLeft, ChevronRight, Heart, Share2 } from 'lucide-react';
import ChannelLogo from './ChannelLogo';
import { countryFlag, displayCountry } from '../utils/m3uParser';
export default function NowPlaying({ channel, favorite, onFavorite, onPrev, onNext, onShare, live }) {
  if (!channel) return <aside className="now-playing"><div className="now-empty"><ChannelLogo channel={{name:'TV'}} large/><h3>Choose a channel</h3><p>Your selected stream will appear here.</p></div></aside>;
  return <aside className="now-playing"><div className="eyebrow"><span className={live ? 'live-dot' : 'status-dot'}/>{live ? 'NOW LIVE' : 'NOW PLAYING'}</div><div className="now-logo"><ChannelLogo channel={channel} large/></div><h1>{channel.name}</h1><p className="now-country">{countryFlag(channel.country)} {displayCountry(channel.country)} <i/> {channel.group}</p><div className="now-actions"><button onClick={() => onFavorite(channel.id)} className={favorite ? 'liked' : ''}><Heart size={17} fill={favorite ? 'currentColor' : 'none'}/> {favorite ? 'Saved' : 'Favorite'}</button><button onClick={onPrev} aria-label="Previous channel"><ChevronLeft size={18}/></button><button onClick={onNext} aria-label="Next channel"><ChevronRight size={18}/></button><button onClick={onShare}><Share2 size={17}/><span>Share</span></button></div></aside>;
}
